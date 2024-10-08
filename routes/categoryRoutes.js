import express from "express";
const router = express.Router();
import { deleteCategory, newCategory, allCategory } from "../controllers/categoryController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/create", checkAuth, newCategory); //Creating a new category
router.get("/", checkAuth, allCategory); //Getting all categories
router.delete("/delete/:id", checkAuth, deleteCategory); //Deleting a category

export default router;
