// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transaction_type: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  amount: { type: Number, required: true }, // Add the amount field
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
