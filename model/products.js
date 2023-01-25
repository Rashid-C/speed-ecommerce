const mongoose=require("mongoose")
const schema=mongoose.Schema  

const productsSchema=new schema(
    {
        name:{
            type:String,
            // required:true,
        },
    
        brand:{
            type:String,
            // required:true,
        },
    
        description:{
            type:String,
            // required:true
        },
    
        stock: {
            type: Number,
            // required: true,
          },
    
        category:{
            type:String,
            // required:true
        },
    
        price:{
            type:Number,
            // required:true,
        },
    
        size:{
            type:String,
            // required:true
        },
        image: [
            {
              url : String,
              filename : String,
            }
          ],
        isDeleted: {
            type: Boolean,
            default: false,
        }
    }
)




const products=mongoose.model("products",productsSchema)
module.exports=products