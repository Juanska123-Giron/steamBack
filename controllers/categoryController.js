import Category from "../models/category.js";

const newCategory = async (req, res) => {
  //Avoid double inserts
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ msg: "Category name is required" });
  }

  const existsCategory = await Category.findOne({ category_name });

  if (existsCategory) {
    const error = new Error("Category already exists");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "There was an error creating the category" });
  }
};

const deleteCategory = async (req, res) => {
  //Erase a category by its id
  const categoryId = req.params.id; //Getting the id of the category inside the URL
  console.log("ID of category to erase:", categoryId);

  try {
    //First check if the category exists
    const existsCategory = await Category.findById(categoryId);

    if (!existsCategory) {
      const error = new Error("You can not delete a category which does not exist");
      return res.status(400).json({ msg: error.message });
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    res.json({
      mensaje: "Successfully deleted the category",
      deletedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Error deleting the category",
    });
  }
};

const fetchCategories = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find();

    // Verify whether there area more than 2 catergories
    if (!categories || categories.length === 0) {
      return res.status(404).json({ msg: "No categories found" });
    }

    // Return the categories
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error fetching categories",
    });
  }
};

export { newCategory, deleteCategory, fetchCategories };
