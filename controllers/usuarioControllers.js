import generarId  from "../helpers/generarId.js";
import Usuario from "../models/usuario.js";
import generarJWT from "../helpers/generarJW.js";
const registrar = async (req, res) => {
    //Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }
    
    try{
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();
        res.json(usuarioAlmacenado);
    }catch (error){
        console.log(error);
    }
};

const autenticar = async (req, res) =>{
    //Comprobar si el usuario exsite
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    //console.log(usuario);
    if (!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }
    //Comprobar si el usuario está confirmado
    if (!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }
    //Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};
const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar){
        const error = new Error("El token no válido");
        return res.status(403).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" });
        console.log(usuarioConfirmar);
    } catch (error) {
        console.log(error);
    }
    // resto de la lógica para confirmar el usuario
};
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }
    try{
        usuario.token = generarId();
        console.log(usuario);
        await usuario.save();
        res.json({ msg: 'Hemos enviado un email con las instrucciones'});
    } catch(error){
        console.log(error);
    }
};
const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({ token });
    if(tokenValido){
        console.log('Token valido');
        res.json({ msg: 'Token valido, el usuario existe'});
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }
};
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const usuario = await Usuario.findOne({ token });
    if (usuario){
        usuario.password = password;
        usuario.token = '';
        try{
            await usuario.save();
            res.json({ msg: 'Password modificado correctamente'});
        }catch(error){
            console.log(error);
        }
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }
};

const perfil =  (req, res) => {
    const { usuario } = req;
    res.json(usuario);
};

const obtenerPerfil = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
  
      if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ msg: error.message });
      }
  
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener el perfil del usuario' });
    }
};
export {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil, obtenerPerfil};
