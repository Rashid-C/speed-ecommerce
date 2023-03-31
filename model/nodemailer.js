const mongoose = require("mongoose");
const schema = mongoose.Schema;

const otpSchema = new schema({
  otp: {
    type: Number,
    required: true,
  },
});

const otp = mongoose.model("otp", otpSchema);
module.exports = otp;
