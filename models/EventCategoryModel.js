const mongoose = require("mongoose");

const eventcat = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  fees: {
    type: mongoose.Schema.Types.Number,
    required: true,
    min: [0, "Fees must be a positive number"],
  },
  commisonPercentage: {
    type: mongoose.Schema.Types.Number,
    required: true,
    min: [0, "Commission % must be >= 0"],
    max: [100, "Commission % cannot exceed 100"],
  },
  commission: { type: mongoose.Schema.Types.Number },
});


eventcat.pre("save", function (next) {
  if (this.commisonPercentage != null && this.fees != null) {
    this.commission = (this.commisonPercentage / 100) * this.fees;
  }
  next();
});

module.exports = mongoose.model("Eventcategory", eventcat);
