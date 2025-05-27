const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    priceSlot: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Slot', SlotSchema);
