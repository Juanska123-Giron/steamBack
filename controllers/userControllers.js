import generateId from "../helpers/generateId.js";
import User from "../models/user.js";
import Country from "../models/country.js";
import generateJWT from "../helpers/generateJW.js";
import nodemailer from "nodemailer";

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // service to send confirmation email
    auth: {
      user: process.env.EMAIL_USER, // My personal email address --> We have to create a Steam account
      pass: process.env.EMAIL_PASS, // Password
    },
  });

  const confirmUrl = `http://localhost:3000/api/users/confirm/${user.token}`; //We have to change this server when its deployed
  //Pending to edit the email estructure
  const mailOptions = {
    from: '"Steam V1" <steamv1@teamSteam.com>', //
    to: user.email, // user email
    subject: "Please confirm your account",
    html: `
        <h2>Hello, ${user.user_name}</h2>
        <p>Thank you for registering. Please confirm your account by clicking the button below:</p>
        <a href="${confirmUrl}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Confirm Account</a>
        <p>If you can't click the button, copy and paste the following link into your browser:</p>
        <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      `,
  };

  await transporter.sendMail(mailOptions);
};

const newUser = async (req, res) => {
  //Avoid double inserts
  const { email } = req.body;
  const userExits = await User.findOne({ email });

  if (userExits) {
    const error = new Error("User already exists");
    return res.status(400).json({ msg: error.message });
  }

  const { country_id } = req.body;
  //console.log("Selected Country:", country_id);
  const availableCountry = await Country.findById(country_id);
  //console.log("Validated:", availableCountry);
  if (!availableCountry) {
    const error = new Error("You must select an exising country_Id");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    const userCreated = await user.save();

    // send the email
    await sendConfirmationEmail(user);

    res.json({
      msg: "User created successfully. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "There was an error creating the user" });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // user exits
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("No user found with that email");
      return res.status(404).json({ msg: error.message });
    }

    // Verify if its an valid account
    if (!user.confirmed) {
      const error = new Error(
        "Your account is not confirmed yet. Please check your email to confirm."
      );
      return res.status(403).json({ msg: error.message });
    }

    // Verify the password
    const isPasswordCorrect = await user.verifyPassword(password);
    if (isPasswordCorrect) {
      res.json({
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        token: generateJWT(user._id),
      });
    } else {
      const error = new Error("Incorrect password. Please try again.");
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "An error occurred while trying to authenticate the user" });
  }
};

const confirmAccount = async (req, res) => {
  //This a GET request, thas why we use 'req.params'
  const { token } = req.params;
  const userToConfirm = await User.findOne({ token });
  if (!userToConfirm) {
    const error = new Error("No valid token");
    return res.status(403).json({ msg: error.message });
  }
  try {
    userToConfirm.confirmed = true;
    userToConfirm.token = "";
    await userToConfirm.save(); //Save changes
    res.json({ msg: "User confirmed successfully" });
    console.log(userToConfirm);
  } catch (error) {
    console.log(error);
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email });
  if (!userFound) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }
  try {
    userFound.token = generateId();
    console.log(userFound);
    await userFound.save();
    res.json({ msg: "He have sent you an email with the instructions and the token" }); //We have to create a page to change the password, gotta use the nodemailer to send the new token
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Valid token, user exists" });
  } else {
    const error = new Error("Not a valid token");
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
      res.json({ msg: "Password modified correctly" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("No valid token");
    return res.status(404).json({ msg: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      const error = new Error("User not found");
      return res.status(404).json({ msg: error.message });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error getting the user profile" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        msj: "User to delete not found",
      });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({
      mensaje: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "There was an error deleting the user",
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
