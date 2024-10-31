import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    id_requirements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirements",
      required: false,
    },

    id_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    photos: {
      type: [String], //To use cloud, importing images with URLs
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;