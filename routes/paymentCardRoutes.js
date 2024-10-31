import express from "express";
const router = express.Router();
import { processPayment } from "../controllers/paymentCardController.js";
import checkAuth from "../middleware/checkAuth.js";
router.post("/process", checkAuth, processPayment);

export default router;