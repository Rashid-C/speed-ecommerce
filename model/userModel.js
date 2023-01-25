const mongoose=require("mongoose")
const schema=mongoose.Schema

const userSchema=new schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },password:{
            type:String,
            required:true
        }
    }
)
const userdetails=mongoose.model("userDetails",userSchema)
module.exports=userdetails