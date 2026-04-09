import mongoose from "mongoose";
let todoSchema = mongoose.Schema({
    title:{
        type:String,
        trim:true,
        lowecase:true,
        minLength:[6, " min 6  is required"],
        maxLength:[200, "maxlength  must be 200 pluse "]
    },
    description:{
        type:String,
        required:true,
        unique:true,
        
    },
    user_id:{
        type:mongoose.Schema.ObjectId, ref:"user",
        required:true
    }


})


 let user = mongoose.model("user", userSchema)
  export default user