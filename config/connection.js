const mongoose = require("mongoose");
//require('dotenv').config();
module.exports = {
  dbConnect: async () => {
    try {
      mongoose.set('strictQuery', false)
      mongoose
        .connect("mongodb://127.0.0.1:27017/ecommerce", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })

        .then((result) => {
          console.log("db connected");
        });
    } catch (error) {
      console.log(error);
    }
  },
};