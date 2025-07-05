const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Transaction = require("./models/Transaction");

app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.post("/transactions", async (req, res) => {
  const transaction = new Transaction(req.body);
  await transaction.save();
  res.json(transaction);
});

app.put("/transactions/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(4000, () => console.log("Server running on port 4000"));
