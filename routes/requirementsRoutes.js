import express from "express";
const router = express.Router();
import {
  deleteRequirement,
  editRequirement,
  newRequirement,
} from "../controllers/requirementsController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/", checkAuth, newRequirement);
router.delete("/delete/:id", deleteRequirement);
router.put("/edit/:id", checkAuth, editRequirement);

export default router;