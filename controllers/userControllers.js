import generateId from "../helpers/generateId.js";
import User from "../models/user.js";
import Country from "../models/country.js";
import generateJWT from "../helpers/generateJW.js";
import nodemailer from "nodemailer";

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // servicio para enviar el correo de confirmación
    auth: {
      user: process.env.EMAIL_USER, // Mi correo personal --> Debemos crear una cuenta de Steam
      pass: process.env.EMAIL_PASS, // Contraseña
    },
  });

  const confirmUrl = `https://prod.supersteam.pro/api/users/confirm/${user.token}`; // Cambiaremos este servidor cuando se despliegue
  // Pendiente de editar la estructura del correo
  const mailOptions = {
    from: '"Steam V1" <steamv1@teamSteam.com>',
    to: user.email, // correo del usuario
    subject: "Por favor confirma tu cuenta",
    html: `
        <h2>Hola, ${user.user_name}</h2>
        <p>Gracias por registrarte. Por favor confirma tu cuenta haciendo clic en el botón de abajo:</p>
        <a href="${confirmUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Confirmar Cuenta</a>
        <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      `,
  };

  await transporter.sendMail(mailOptions);
};

const newUser = async (req, res) => {
  const { email, country_id } = req.body;

  // Verificar si el correo ya está registrado
  const userExits = await User.findOne({ email });
  if (userExits) {
    return res.status(400).json({ msg: "Ya hay un usuario con ese correo", field: "email" });
  }

  // Verificar si el país existe
  const availableCountry = await Country.findById(country_id);
  if (!availableCountry) {
    return res
      .status(400)
      .json({ msg: "Debes seleccionar un país existente", field: "country_id" });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    await user.save();

    await sendConfirmationEmail(user);

    return res.json({
      msg: "Usuario creado exitosamente. Revisa tu correo para confirmar tu cuenta",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al crear el usuario" });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("No se encontró un usuario con ese correo electrónico");
      return res.status(404).json({ msg: error.message });
    }

    // Verificar si la cuenta está confirmada
    if (!user.confirmed) {
      const error = new Error(
        "Tu cuenta aún no está confirmada. Por favor, revisa tu correo electrónico para confirmarla."
      );
      return res.status(403).json({ msg: error.message });
    }

    // Verificar la contraseña
    const isPasswordCorrect = await user.verifyPassword(password);
    if (isPasswordCorrect) {
      res.json({
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        token: generateJWT(user._id),
      });
    } else {
      const error = new Error("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Ocurrió un error al intentar autenticar al usuario" });
  }
};

const confirmAccount = async (req, res) => {
  // Esta es una solicitud GET, por eso usamos 'req.params'
  const { token } = req.params;
  const userToConfirm = await User.findOne({ token });
  if (!userToConfirm) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    userToConfirm.confirmed = true;
    userToConfirm.token = "";
    await userToConfirm.save(); // Guardar los cambios
    res.json({ msg: "Usuario confirmado exitosamente" });
    console.log(userToConfirm);
  } catch (error) {
    console.log(error);
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if (!userFound) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    userFound.token = generateId();
    console.log(userFound);
    await userFound.save();
    res.json({ msg: "Te hemos enviado un correo con las instrucciones y el token" }); // Debemos crear una página para cambiar la contraseña, debemos usar nodemailer para enviar el nuevo token
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Token válido, el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const changePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Contraseña modificada correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el perfil del usuario" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        msg: "Usuario a eliminar no encontrado",
      });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({
      msg: "Usuario eliminado exitosamente",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo un error al eliminar el usuario",
    });
  }
};

export {
  newUser,
  authenticateUser,
  confirmAccount,
  recoverPassword,
  validateToken,
  changePassword,
  getProfile,
  deleteUser,
};
