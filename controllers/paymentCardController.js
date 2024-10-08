import PaymentCard from "../models/paymentCard.js";
import User from "../models/user.js";
import validator from "validator";

const newCard = async (req, res) => {
  const userId = req.user._id; //Extracting información from the token
  console.log("IdUser from checkAuth", userId);

  const { card_number } = req.body; //extract the variables

  // Validate
  if (!validator.isCreditCard(card_number)) {
    return res.status(400).json({ msg: "Invalid credit card number" });
  } else console.log("Proving card: ", req.body);

  try {
    const newPaymentCard = new PaymentCard(req.body);
    const savedCard = await newPaymentCard.save();

    //Look for the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //asociate the card to the user logged in
    user.payments_cards.push(savedCard._id); //pushing the info to the attribute
    await user.save(); //update the information

    res.json({
      msg: "Card added successfully",
      savedCard,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error creating card" });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await PaymentCard.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        msj: "Card not found",
      });
    }
    const deletedCard = await PaymentCard.findByIdAndDelete(req.params.id);
    res.json({
      msj: "Card deleted successfully",
      deletedCard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "There was an error deleting the card",
    });
  }
};

export { newCard, deleteCard };
