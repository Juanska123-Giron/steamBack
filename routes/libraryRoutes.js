import express from "express";
import { getUserLibrary } from "../controllers/libraryController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta para obtener la biblioteca del usuario
router.get("/", checkAuth, getUserLibrary);

export default router;