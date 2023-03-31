const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const wishSchema = new schema({
  userId: {
    type: String,
    required: true,
  },
  product: [
    {
      productId: {
        type: ObjectId,
        required: true,
        ref: "products",
      },
    },
  ],
});
const wishList = mongoose.model("wishList", wishSchema);
module.exports = wishList;
