import Country from "../models/country.js";

const newCountry = async (req, res) => {
  //Avoid double inserts
  const { country_name } = req.body;
  const existsCountry = await Country.findOne({ country_name });

  if (existsCountry) {
    const error = new Error("Country already exists");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const country = new Country(req.body);
    const savedCountry = await country.save();
    res.json(savedCountry);
  } catch (error) {
    console.log(error);
  }
};

const deleteCountry = async (req, res) => {
  //Erase a country by its id
  const countryId = req.params.id; //Getting the id of the country inside the URL
  console.log("ID of country to erase:", countryId);

  try {
    //First check if the country exists
    const existsCountry = await Country.findById(countryId);

    if (!existsCountry) {
      const error = new Error("You can not delete a country which does not exist");
      return res.status(400).json({ msg: error.message });
    }

    const deletedCountry = await Country.findByIdAndDelete(countryId);

    res.json({
      mensaje: "Successfully deleted the country",
      deletedCountry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error deleting the country",
    });
  }
};

export { newCountry, deleteCountry };
