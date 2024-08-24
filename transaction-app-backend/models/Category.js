const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  budget: {
    type: Number,
    required: true, // Set this to true if every category must have a budget
    default: 0, // You can set a default budget, for example, 0
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
