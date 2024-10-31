import mongoose from "mongoose";

const librarySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    games: [
      {
        gameId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game", // Asegúrate de que tienes un modelo de juegos
        },

        title: String, // Título del juego
        price: Number,
        photos: [String],
        description: String,
        developer: String,
        release_date: Date,
        file: String,
        id_category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
        id_requirements: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Requirements",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Library = mongoose.model("Library", librarySchema);
export default Library;