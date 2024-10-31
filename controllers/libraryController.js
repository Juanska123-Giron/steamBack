import Library from "../models/library.js";
import Game from "../models/game.js";

const createLibrary = async (req, res) => {
  // Getting the authenticated user's ID from checkAuth middleware
  const userId = req.user._id;

  const { gameIds } = req.body;

  try {
    // checking if the user already has a library
    const existingLibrary = await Library.findOne({ user: userId });

    if (existingLibrary) {
      return res.status(400).json({ msg: "Already have a library, add some games" });
    }

    // Verify if the games exist in the database
    const games = await Game.find({ _id: { $in: gameIds } });
    if (games.length !== gameIds.length) {
      return res.status(404).json({ msg: "One or more games not found" });
    }

    const newLibrary = new Library({
      user: userId,
      games: gameIds,
    });

    const savedLibrary = await newLibrary.save();

    // Respond with success and the created library
    res.status(201).json({
      msg: "Library created successfully",
      library: savedLibrary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error creating the library",
    });
  }
};

const AddGamesToLibrary = async (req, res) => {
  // Authenticated user's ID from checkAuth middleware
  const userId = req.user._id;
  const { gameIds } = req.body;

  try {
    const existingLibrary = await Library.findOne({ user: userId });

    if (!existingLibrary) {
      return res.status(404).json({ msg: "Library not found, please create one first" });
    }

    // Filter out any games that are already in the user's library
    const newGames = gameIds.filter((gameId) => !existingLibrary.games.includes(gameId));

    if (newGames.length === 0) {
      return res.status(400).json({
        msg: "All games are already in your library",
      });
    }

    // Verify if the new game IDs exist in the database
    const games = await Game.find({ _id: { $in: newGames } });
    if (games.length !== newGames.length) {
      return res.status(404).json({ msg: "One or more games not found" });
    }

    // Add the new games to the library
    existingLibrary.games.push(...newGames);

    // Save the updated library
    const updatedLibrary = await existingLibrary.save();

    // Return success message and the updated library
    res.status(200).json({
      msg: "Games added to your library",
      library: updatedLibrary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error adding games to the library",
    });
  }
};

export { createLibrary, AddGamesToLibrary };
