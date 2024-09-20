import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";
const checkAuth = async (req, res, next) => {
    let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );
      console.log(req.usuario);
      return next();
    } catch (error) {
      return res.status(401).json({ msg: "Token inválido" });
    }
  } else {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }
};

export default checkAuth;