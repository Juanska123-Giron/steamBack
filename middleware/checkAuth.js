import jwt from "jsonwebtoken";
import User from "../models/user.js";
const checkAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select(
        "-password -confirmado -token -createdAt -updatedAt -__v"
      );
      console.log(req.user);
      return next();
    } catch (error) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "No given token" });
  }
};

export default checkAuth;
