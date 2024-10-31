import express from "express";
const router = express.Router();
import {
  newUser,
  authenticateUser,
  confirmAccount,
  recoverPassword,
  validateToken,
  changePassword,
  getProfile,
  deleteUser,
} from "../controllers/userControllers.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/", newUser); //Creating a new user
router.post("/login", authenticateUser); //Login
router.get("/confirm/:token", confirmAccount);
router.post("/forgot-password", recoverPassword); //Forgot Password
router.route("/forgot-password/:token").get(validateToken).post(changePassword);
router.get("/profile/:id", checkAuth, getProfile);
router.delete("/profile/delete/:id", deleteUser);

export default router;
