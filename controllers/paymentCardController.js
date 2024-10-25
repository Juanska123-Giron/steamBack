import PaymentCard from "../models/paymentCard.js";
import User from "../models/user.js";
import Game from "../models/game.js"; // Asegúrate de que la ruta sea correcta
import Stripe from "stripe";
import dotenv from "dotenv";
import { addToLibrary } from "./libraryController.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
  const { amount, gameIds } = req.body;
  const userId = req.user._id;

  console.log("Game IDs received:", gameIds);

  try {
    // Verificación de que se proporcionan gameIds válidos
    if (!gameIds || gameIds.length === 0) {
      return res.status(400).json({ msg: "No se proporcionaron gameIds válidos." });
    }

    // Verificar que los juegos existan en la base de datos
    const games = await Game.find({ _id: { $in: gameIds } });
    if (games.length !== gameIds.length) {
      console.error("No se encontraron todos los juegos en la biblioteca.");
      return res.status(404).json({ msg: "Algunos juegos no se encontraron." });
    }

    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Añadir juegos a la biblioteca
    await Promise.all(gameIds.map((gameId) => addToLibrary(userId, gameId)));

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error procesando el pago:", error);
    res.status(500).json({ msg: 'Error al procesar el pago: ' + error.message });
  }
};

export { processPayment };
