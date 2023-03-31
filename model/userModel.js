const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      url: String,
    },

    primaryAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      house: {
        type: String,
      },
      email: {
        type: String,
      },
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      district: {
        type: String,
      },
      state: {
        type: String,
      },
      pin: {
        type: Number,
      },
      mobile: {
        type: Number,
      },
    },
    couponId: {
      type: String,
    },
  },
  { timestamps: true }
);
const userdetails = mongoose.model("userDetails", userSchema);
module.exports = userdetails;
