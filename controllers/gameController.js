import Game from "../models/game.js";

const getAllGames = async (req, res) => {
  try {
    const { category } = req.query; // Obtener el parámetro de categoría de la consulta
    let query = {};

    if (category) {
      query.id_category = category; // Filtrar por la categoría, ajusta según tu esquema
    }

    const games = await Game.find(query); // Realizar la consulta filtrada o sin filtro
    res.status(200).json(games);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error getting games",
    });
  }
};

const newGame = async (req, res) => {
  console.log(req.body);
  try {
    const { game_name, description, developer, photos, release_date, price, file, id_category } =
      req.body;

    const existingGame = await Game.findOne({ game_name });
    if (existingGame) {
      return res.status(400).json({ mensaje: "Game already in system" });
    }

    // Create a new (Game)
    const game = new Game({
      game_name,
      description,
      developer,
      photos,
      release_date,
      price,
      file,
      id_category,
    });

    await game.save();

    res.status(201).json({
      mensaje: "Game created successfully",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error fetching the data",
    });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ mensaje: "Game not found" });
    }

    res.status(200).json({ mensaje: "Game deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error deleting the game",
    });
  }
};

const editGame = async (req, res) => {
  const { id } = req.params;
  const { game_name, description, developer, photos, release_date, price, file, id_category } =
    req.body; //Getting the variables

  try {
    const game = await Game.findByIdAndUpdate(
      id,
      {
        game_name,
        description,
        developer,
        photos,
        release_date,
        price,
        file,
        id_category,
      },
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({ mensaje: "Game not found" });
    }

    res.status(200).json({
      mensaje: "Game updated successfully",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error updating the game",
    });
  }
};

const addRequirementsToGame = (req, res) => {};

export { getAllGames, newGame, deleteGame, editGame };
