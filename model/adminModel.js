const mongoose=require("mongoose")
const schema=mongoose.Schema

const adminSchema=new schema(
    {
        username:{
           type:String,
           required:true
        },
        password:{
            type:String,
            required:true
        }

})
const admindetails=mongoose.model("admindetails",adminSchema)
module.exports=admindetails