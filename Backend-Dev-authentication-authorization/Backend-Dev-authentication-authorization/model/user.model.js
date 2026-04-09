import mongoose from "mongoose";
let userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        lowecase:true,
        minLength:[6, " min 6  is required"],
        maxLength:[200, "maxlength  must be 200 pluse "]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
    }
})


 let user = mongoose.model("user", userSchema)
  export default user