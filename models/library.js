import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    games: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Library = mongoose.model("Library", librarySchema);

export default Library;
