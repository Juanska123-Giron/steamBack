import express from "express";
const router = express.Router();
import { deleteCategory, newCategory, fetchCategories } from "../controllers/categoryController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/", checkAuth, newCategory); //Creating a new category
router.delete("/delete/:id", checkAuth, deleteCategory); //Deleting a category
router.get("/getAllCategories", checkAuth, fetchCategories);

export default router;
