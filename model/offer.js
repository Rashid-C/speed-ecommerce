const mongoose = require("mongoose");
const schema = mongoose.Schema;

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});
const offer = mongoose.model("offer", offerSchema);
module.exports = offer;
