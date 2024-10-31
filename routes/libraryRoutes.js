import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { createLibrary, AddGamesToLibrary } from "../controllers/libraryController.js";

const router = express.Router();

router.post("/create/", checkAuth, createLibrary);
router.post("/addGames/", checkAuth, AddGamesToLibrary);

export default router;
