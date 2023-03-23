const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const ObjectId = mongoose.Types.ObjectId;
const ObjectId = schema.ObjectId;

const orderSchema = new schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    address: {
      firstName: {
        type: String,
      },

      lastname: {
        type: String,
      },
      house: {
        type: String,
      },

      district: {
        type: String,
      },
      state: {
        type: String,
      },
      street: {
        type: String,
      },
      mobile: {
        type: Number,
      },
      pin: {
        type: Number,
      },
      city: {
        type: String,
      },
    },

    orderItem:[
      { type:ObjectId,
      ref:"products"}
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus : {
        type : String,
        required : true
    },
    paymentStatus: {
      type: String,
      // default: "Not Paid",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    date:{
      type:String,
      required:true,
    }
  },
  { timestamps: true },

);

const order = mongoose.model("order", orderSchema);
module.exports = order;
