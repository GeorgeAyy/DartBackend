const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { predictCategory } = require("../services/genAIService");

// Get all transactions for the authenticated user
const getTransactions = async (req, res) => {
  console.log("getTransactions called");
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate("category") // Populate category reference
      .exec();

    console.log("Transactions fetched:", transactions);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Add a new transaction
const addTransaction = async (req, res) => {
  console.log("addTransaction called with data:", req.body);
  const { transaction_type, category, amount } = req.body;

  try {
    let categoryDoc = null;

    if (category) {
      categoryDoc = await Category.findOne({
        _id: category,
        user: req.user._id,
      });
      console.log("Category found:", categoryDoc);
      if (!categoryDoc) {
        console.error("Category not found or not owned by user");
        return res.status(400).json({ message: "Category not found" });
      }
    }

    const transaction = new Transaction({
      user: req.user._id,
      transaction_type,
      category: categoryDoc ? categoryDoc._id : null,
      amount,
    });

    const createdTransaction = await transaction.save();
    console.log("Transaction created:", createdTransaction);
    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing transaction
const updateTransaction = async (req, res) => {
  console.log("updateTransaction called with ID:", req.params.id);
  const { transaction_type, category, amount } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);
    console.log("Transaction found:", transaction);

    if (!transaction) {
      console.error("Transaction not found");
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      console.error("User not authorized to update this transaction");
      return res.status(401).json({ message: "Not authorized" });
    }

    let categoryDoc = null;

    if (category) {
      categoryDoc = await Category.findOne({
        _id: category,
        user: req.user._id,
      });
      console.log("Category found:", categoryDoc);
      if (!categoryDoc) {
        console.error("Category not found or not owned by user");
        return res.status(400).json({ message: "Category not found" });
      }
    }

    transaction.transaction_type = transaction_type;
    transaction.category = categoryDoc ? categoryDoc._id : null;
    transaction.amount = amount;

    const updatedTransaction = await transaction.save();
    console.log("Transaction updated:", updatedTransaction);

    // Update all transactions with the same transaction_type
    if (transaction_type && categoryDoc) {
      const updateResult = await Transaction.updateMany(
        { transaction_type: transaction_type, user: req.user._id },
        { $set: { category: categoryDoc._id } }
      );
      console.log(
        `Updated ${updateResult.modifiedCount} transactions with the same transaction type.`
      );
    }

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Delete a transaction
const deleteTransaction = async (req, res) => {
  console.log("deleteTransaction called with ID:", req.params.id);

  try {
    const transaction = await Transaction.findById(req.params.id);
    console.log("Transaction found:", transaction);

    if (!transaction) {
      console.error("Transaction not found");
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      console.error("User not authorized to delete this transaction");
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.remove();
    console.log("Transaction removed");
    res.json({ message: "Transaction removed" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Predict the category for a transaction type
const categorizeTransaction = async (req, res) => {
  console.log("categorizeTransaction called with data:", req.body);
  const { transaction_type } = req.body;

  try {
    const existingTransactions = await Transaction.find({ user: req.user._id })
      .populate("category")
      .exec();
    console.log("Existing transactions fetched:", existingTransactions);

    const existingCategories = [
      ...new Set(
        existingTransactions
          .filter((transaction) => transaction.category !== null)
          .map((transaction) => transaction.category.name)
      ),
    ];

    console.log("Existing categories:", existingCategories);

    const predictedCategoryName = await predictCategory(
      transaction_type,
      existingCategories
    );
    console.log("Predicted category name:", predictedCategoryName);

    // Check if the predicted category already exists for the user in the database
    let predictedCategory = await Category.findOne({
      name: predictedCategoryName,
      user: req.user._id,
    });

    if (!predictedCategory) {
      console.log("Predicted category not found, creating new category");
      predictedCategory = new Category({
        name: predictedCategoryName,
        user: req.user._id, // Associate the category with the logged-in user
      });
      await predictedCategory.save();
    }

    console.log("Predicted category:", predictedCategory);
    res.json({ category: predictedCategory._id });
  } catch (error) {
    console.error("Error predicting category:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeTransaction,
};
