import express from "express";
const router = express.Router();
import { deleteCard, newCard, chargeUser } from "../controllers/paymentCardController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/", checkAuth, newCard); //Creating a new card
router.delete("/delete/:id", deleteCard); //Deleting a card;
router.post("/charge", chargeUser); //Charging a user

export default router;
