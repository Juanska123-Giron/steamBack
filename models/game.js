import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
  {
    id_requirements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requirements',
      required: true,
    },
    id_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    game_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    developer: {
      type: String,
      required: true,
      trim: true,
    },
    release_date: {
      type: Date,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    archivo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
  }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
