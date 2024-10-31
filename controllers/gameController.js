import Game from "../models/game.js";
import Requirements from "../models/requirements.js";

const getAllGames = async (req, res) => {
  try {
    const { category, includeRequirements } = req.query; // Obtener los parámetros de consulta
    let query = {};

    if (category) {
      query.id_category = category; // Filtrar por la categoría
    }

    // Realizar la consulta inicial
    const gamesQuery = Game.find(query)
      .populate("id_category", "category_name")
      .populate(
        "id_requirements",
        "platform processor memory graphics storage"
      );

    const games = await gamesQuery.exec(); // Ejecutar la consulta
    console.log("Games fetched:", games);

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
    const {
      game_name,
      description,
      developer,
      photos,
      release_date,
      price,
      file,
      id_category,
    } = req.body;

    const existingGame = await Game.findOne({ game_name });
    if (existingGame) {
      return res.status(400).json({ msj: "Game already in system" });
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
      msj: "Game created successfully",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error fetching the data",
    });
  }
};

const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ msj: "Game not found" });
    }

    res.status(200).json({ msj: "Game deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error deleting the game",
    });
  }
};

const editGame = async (req, res) => {
  const { id } = req.params;
  const {
    game_name,
    description,
    developer,
    photos,
    release_date,
    price,
    file,
    id_category,
  } = req.body; //Getting the variables

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
      return res.status(404).json({ msj: "Game not found" });
    }

    res.status(200).json({
      msj: "Game updated successfully",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error updating the game",
    });
  }
};

const addRequirementsToGame = async (req, res) => {
  const { id_game } = req.params; // id from the game
  const { id_requirements } = req.body; // This goes in the request body

  try {
    // Verify tehe games exists
    const game = await Game.findById(id_game);

    if (!game) {
      return res.status(404).json({ msg: "Game not found" });
    }

    // Verify the requirements exists
    const requirements = await Requirements.findById(id_requirements);

    if (!requirements) {
      return res.status(404).json({ msg: "Requirements not found" });
    }

    // Assign the requirements as an attribute to the game
    game.id_requirements = id_requirements;

    // Saving the changes
    await game.save();

    // Successfully done
    res.status(200).json({
      msg: "Requirements added to game successfully",
      game,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error adding requirements to the game",
    });
  }
};

export { getAllGames, newGame, deleteGame, editGame, addRequirementsToGame };
