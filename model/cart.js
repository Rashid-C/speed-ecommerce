const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;
const cartSchema = new schema({
    userId:{
        type:String,
        required:true,
    },
    product:[
        {
            productId:{
                type:ObjectId,
                required:true,
                ref:"products"
            },
            quantity:{
                type:Number,
                default:1,
                required:true,
                
            },
           
        }
    ]
});

const carts = mongoose.model("carts", cartSchema);
module.exports = carts;
