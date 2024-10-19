import mongoose from "mongoose";
import bcrypt from "bcrypt";

const paymentCardSchema = mongoose.Schema(
  {
    name_holder: {
      type: String,
      required: true,
      trim: true,
    },
    card_number: {
      type: String,
      required: true,
      trim: true,
    },
    cvc: {
      type: String,
      required: true,
      trim: true,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to encrypt the card number
paymentCardSchema.pre("save", async function (next) {
  if (!this.isModified("card_number")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.card_number = await bcrypt.hash(this.card_number, salt);
});

//Compare card_numbers
paymentCardSchema.methods.compareCardNumbers = async function (cardNumberForm) {
  return await bcrypt.compare(cardNumberForm, this.card_number);
};

const PaymentCard = mongoose.model("PaymentCard", paymentCardSchema);
export default PaymentCard;
