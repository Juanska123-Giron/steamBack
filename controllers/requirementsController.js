import Requirements from "../models/requirements.js";

const getRequirement = async (req, res) => {
  const gameId = req.params.id;
  try {
    const requirement = await Requirements.findById(gameId);

    if (!requirement) {
      return res.status(404).json({
        msj: "Requirement not found",
      });
    }

    res.json({
      msj: "Requirement found successfully",
      requirement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error retrieving the requirement",
    });
  }
};

//Post request

const newRequirement = async (req, res) => {
  try {
    const { platform, processor, memory, graphics, storage } = req.body;

    //Create new requirement
    const requirements = new Requirements({
      platform,
      processor,
      memory,
      graphics,
      storage,
    });

    //save the requirement
    const savedRequirements = await requirements.save();

    //Respuesta exitosa
    res.status(201).json({
      mensaje: "Requerimients created successfully",
      savedRequirements,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error creating the requirement",
    });
  }
};

const deleteRequirement = async (req, res) => {
  const idRequirement = req.params.id;
  console.log("REQUIREMENT: ", idRequirement);
  try {
    const requirement = await Requirements.findById(req.params.id);

    if (!requirement) {
      return res.status(404).json({
        msj: "Requirement not found",
      });
    }
    const deletedRequirement = await Requirements.findByIdAndDelete(req.params.id);
    res.json({
      msj: "Requirement deleted successfully",
      deletedRequirement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error deleting the requirement",
    });
  }
};

export { newRequirement, deleteRequirement, getRequirement };
