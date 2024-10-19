import PaymentCard from "../models/paymentCard.js";
import User from "../models/user.js";
import validator from "validator";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Usa tu clave secreta de Stripe

// Función para agregar una nueva tarjeta
const newCard = async (req, res) => {
  const userId = req.user._id; // Asegúrate de que req.user está disponible
  const { card_number, expiration_date, name_holder } = req.body;

  // Validar el número de tarjeta
  if (!validator.isCreditCard(card_number)) {
    return res
      .status(400)
      .json({ msg: "Número de tarjeta de crédito inválido" });
  }

  // Validar la fecha de expiración
  const expDate = new Date(expiration_date);
  if (isNaN(expDate.getTime())) {
    return res.status(400).json({ msg: "Fecha de expiración inválida" });
  }

  try {
    // Crear un método de pago en Stripe
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: card_number,
        exp_month: expDate.getMonth() + 1, // El mes es de índice cero
        exp_year: expDate.getFullYear(),
      },
      billing_details: {
        name: name_holder,
      },
    });

    // Guardar la información de la tarjeta de forma segura en tu base de datos
    const newPaymentCard = new PaymentCard({
      name_holder,
      card_number: paymentMethod.id, // Guarda el ID del método de pago en su lugar
      expiration_date,
    });

    const savedCard = await newPaymentCard.save();

    // Asociar la tarjeta con el usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    user.payments_cards.push(savedCard._id);
    await user.save();

    res.json({
      msg: "Tarjeta añadida con éxito",
      savedCard,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error al crear la tarjeta", error: error.message });
  }
};

// Función para eliminar una tarjeta
const deleteCard = async (req, res) => {
  try {
    const card = await PaymentCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ msg: "Tarjeta no encontrada" });
    }

    const deletedCard = await PaymentCard.findByIdAndDelete(req.params.id);
    res.json({
      msg: "Tarjeta eliminada exitosamente",
      deletedCard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo un error al eliminar la tarjeta",
      error: error.message,
    });
  }
};

// Función para hacer un cargo al usuario
const chargeUser = async (req, res) => {
  const { amount, paymentMethodId } = req.body;

  try {
    // Crear un PaymentIntent con el método de pago proporcionado
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd", // Asegúrate de usar la moneda correcta
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Desactiva métodos que requieran redirección
      },
    });

    res.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al procesar el pago", error: error.message });
  }
};

export { newCard, deleteCard, chargeUser };
