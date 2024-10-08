import express from "express";
const router = express.Router();
import { newCountry, deleteCountry } from "../controllers/countryController.js";
// import checkAuth from "../middleware/checkAuth.js";
router.post("/", newCountry); //Create a new country
router.delete("/:id", deleteCountry); //Delete a country
export default router;
