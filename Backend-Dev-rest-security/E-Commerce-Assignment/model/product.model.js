import mongoose from "mongoose";
let productSchema = mongoose.Schema({
    name:{
        type:String,
        minlength:[4, "please fill the min length"],
        maxlength:[200, "do not allow more then 200"],
        required:true,
        trim:true
    },
    marchant_id:{
        type:mongoose.Schema.ObjectId, ref:"merchant",
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    category_id:{
        type:mongoose.Schema.ObjectId, ref:"category"
    }
})
let product = mongoose.model("product",productSchema)
export default product