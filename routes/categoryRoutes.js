import express from "express";
const router = express.Router();
import { deleteCategory, newCategory } from "../controllers/categoryController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/", checkAuth, newCategory); //Creating a new category
router.delete("/delete/:id", checkAuth, deleteCategory); //Deleting a category

export default router;
