const Category = require("../models/Category");

// Get all categories
const getCategories = async (req, res) => {
  console.log("getCategories called");
  try {
    const categories = await Category.find({ user: req.user._id });
    console.log("Categories fetched:", categories);
    res.json(categories);
  } catch (error) {
    console.error("Failed to retrieve categories:", error.message);
    res.status(500).json({ message: "Failed to retrieve categories" });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  console.log("addCategory called with data:", req.body);
  const { name } = req.body;
  try {
    const newCategory = new Category({
      name,
      user: req.user._id, // Attach the logged-in user's ID
    });
    await newCategory.save();
    console.log("Category added successfully:", newCategory);
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Failed to add category:", error.message);
    res.status(500).json({ message: "Failed to add category" });
  }
};

// Edit an existing category
const editCategory = async (req, res) => {
  console.log("editCategory called with ID:", req.params.id);
  const { name, budget } = req.body; // Destructure the name and budget from the request body

  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure the category belongs to the logged-in user
    });

    if (!category) {
      console.error("Category not found");
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name; // Update the name if provided
    if (budget !== undefined) category.budget = budget; // Update the budget if provided

    await category.save();
    console.log("Category updated successfully:", category);
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Failed to update category:", error.message);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  console.log("deleteCategory called with ID:", req.params.id);
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Ensure the category belongs to the logged-in user
    });

    if (!category) {
      console.error("Category not found");
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Category deleted successfully");
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Failed to delete category:", error.message);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

const getCategoryByID = async (req, res) => {
  console.log("getCategoryByID called with ID:", req.params.id);
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure the category belongs to the logged-in user
    });

    if (!category) {
      console.error("Category not found");
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Category fetched:", category);
    res.json(category);
  } catch (error) {
    console.error("Failed to retrieve category:", error.message);
    res.status(500).json({ message: "Failed to retrieve category" });
  }
};

module.exports = {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryByID,
};
