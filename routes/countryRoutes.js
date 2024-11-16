import express from "express";
const router = express.Router();
import { newCountry, deleteCountry, fetchCountries } from "../controllers/countryController.js";
// import checkAuth from "../middleware/checkAuth.js";
router.post("/", newCountry); //Create a new country
router.delete("/:id", deleteCountry); //Delete a country
router.get("/", fetchCountries);
export default router;
