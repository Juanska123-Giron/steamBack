//soon
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game", // Reference to the Game model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // At least one game is added
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
