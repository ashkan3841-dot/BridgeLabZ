import mongoose from "mongoose";
let todoschema = mongoose.Schema({
    title:{
        type:String,
        minLength:[10,"please uses 10 word of title"],
        maxLength:[50, "title maxlength 50"],
        required:true
    },
    desp:{
        type:String,
        required:true
    },

    user_id:{
        type:mongoose.Schema.ObjectId, ref:"user"
    },
    create_at:{
        type:Date.now,
        default:true
    }
})
let todo = mongoose.model("todo",todoschema)
export default todo