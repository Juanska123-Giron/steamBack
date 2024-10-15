import PaymentCard from "../models/paymentCard.js";
import User from "../models/user.js";

const createCard = async (req, res) => {
  const userId = req.user._id;
  const { name_holder, card_number, expiration_date, cvc } = req.body; // Get card details from request body

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const existingCard = await PaymentCard.findOne({ card_number, user: userId });
    if (existingCard) {
      return res.status(400).json({ msg: "Card already exists" });
    }

    // Create a new payment card
    const newCard = new PaymentCard({
      name_holder,
      card_number,
      expiration_date,
      cvc,
      user: userId,
    });

    // Save the new card in the database
    const savedCard = await newCard.save();
    s;
    res.status(201).json({
      msg: "Card created successfully",
      card: savedCard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error creating the card",
    });
  }
};

export { createCard };
