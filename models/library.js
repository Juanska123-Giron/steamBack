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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Library = mongoose.model("Library", librarySchema);
export default Library;
