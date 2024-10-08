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

export { newCategory, deleteCategory };
