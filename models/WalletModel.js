const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null,
  },
  admin: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ["system", "manual"],
    required: true,
  },
});

const walletSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
