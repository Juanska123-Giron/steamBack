import Requirements from "../models/requirements.js";

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
      msj: "Requerimients created successfully",
      savedRequirements,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error creating the requirement",
    });
  }
};

const deleteRequirement = async (req, res) => {
  const idRequirement = req.params.id;
  //console.log("REQUIREMENT: ", idRequirement);
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

const editRequirement = async (req, res) => {
  const { id } = req.params;
  const { platform, processor, memory, graphics, storage } = req.body;

  try {
    const requirement = await Requirements.findByIdAndUpdate(
      id,
      {
        platform,
        processor,
        memory,
        graphics,
        storage,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!requirement) {
      return res.status(404).json({ msj: "Requirement not found" });
    }
    res.status(200).json({
      msj: "Requirement updated successfully",
      requirement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msj: "Error updating the requirement",
    });
  }
};

export { newRequirement, deleteRequirement, editRequirement };
