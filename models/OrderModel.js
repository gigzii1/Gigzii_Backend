const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    address: { type: String },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    eventCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Eventcategory",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "left_for_event",
        "on_going",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    amount: { type: Number, required: true },
    mark_completed_by_user: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
