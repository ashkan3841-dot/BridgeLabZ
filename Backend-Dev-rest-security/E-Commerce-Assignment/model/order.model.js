import mongoose from "mongoose";
let orderSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId, ref:"userEc",
        required:true,
        unique:true
    },
    status:{
        type:String,
        required:[true, "status is missing"]
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
let order = mongoose.model("order",orderSchema)
export default order