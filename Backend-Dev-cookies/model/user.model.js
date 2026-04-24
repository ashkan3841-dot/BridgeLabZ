``import mongoose from "mongoose";
let userschema = mongoose.Schema({
    name:{
        type:String,
        minLength:[5,"Please minimun name length 5"],
        maxLength:[200, "maximum length 200"],
        required:true,
    },
    email:{
        type:String,
        lowercase:true,
        required:true
    },
    password:{
        type:Number,
        unique:true,
        required:true
    }
})
let user = mongoose.model("user", userschema)
export default user