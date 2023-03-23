const mongoose=require('mongoose')
const schema=mongoose.Schema
const moment=require('moment')
const ObjectId=schema.objectId

const couponSchema=new schema(
    {
        couponName:{
            type:String,
            required:true,
        },
        discount:{
            type:Number,
            required:true,
        },
        // maxLimit:{
        //     type:Number,
        //     required:true,
        // },
        startDate:{
            type:String,
            default:moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
        },
        expiryDate:{
            type:String,
        },
        
        userId:{
                type:String,
            },
        },
 

  {
    timestamps:true,
  },
);

const coupon=mongoose.model("coupon",couponSchema);
module.exports=coupon