import Library from "../models/library.js";
import Game from "../models/game.js";
import User from "../models/user.js";

const addToLibrary = async (userId, gameId) => {
  try {
    const gameInfo = await Game.findById(gameId);
    if (!gameInfo) {
      throw new Error("Juego no encontrado");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Busca o crea una biblioteca para el usuario
    let library = await Library.findOne({ user: userId });

    if (!library) {
      library = new Library({ user: userId, games: [] });
    }

    // Verifica si el juego ya está en la biblioteca
    const gameExists = library.games.some(game => game && game.gameId && game.gameId.toString() === gameId);
    if (!gameExists) {
      library.games.push({
        gameId: gameInfo._id,
        title: gameInfo.game_name,
        price: gameInfo.price,
      });
      await library.save();
      console.log(`Juego ${gameInfo.game_name} añadido a la biblioteca`);
    } else {
      console.log(`El juego ${gameInfo.game_name} ya está en la biblioteca`);
    }
  } catch (error) {
    console.error("Error al añadir juego a la biblioteca:", error);
    throw new Error("Error al añadir juego a la biblioteca: " + error.message);
  }
  
};



// Obtener los juegos en la biblioteca del usuario
const getUserLibrary = async (req, res) => {
  try {
    const userId = req.user._id;
    const library = await Library.findOne({ user: userId }).populate("games");

    if (!library) {
      return res
        .status(404)
        .json({ msg: "No se encontró la biblioteca del usuario" });
    }

    res.json(library);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener la biblioteca", error: error.message });
  }
};

export { addToLibrary, getUserLibrary };
