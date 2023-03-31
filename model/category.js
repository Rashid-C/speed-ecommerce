const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema(
  {
    category: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const category = mongoose.model("category", categorySchema);
module.exports = category;
