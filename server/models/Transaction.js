const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: Date,
  description: String,
  category: String,
});

module.exports = mongoose.model("Transaction", transactionSchema);
