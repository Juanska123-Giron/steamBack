import express from "express";
const router = express.Router();
import { deleteRequirement, newRequirement, getRequirement } from "../controllers/requirementsController.js";
import checkAuth from "../middleware/checkAuth.js";
router.get("/:id", getRequirement);
router.post("/new", checkAuth, newRequirement);
router.delete("/delete/:id", deleteRequirement);

export default router;
