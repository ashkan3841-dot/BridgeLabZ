import mongoose, { now } from "mongoose";
let userSchema = mongoose.Schema({
    full_name:{
        type:String,
        minlength:[4, "please fill the min length"],
        maxlength:[200, "do not allow more then 200"],
        required:true,
        trim:true
    },
    email:{
        type:String,
        minlength:[10, "email length most be 10th"],
        maxlength:[200, "data should to 200"],
        trim:true,
        required:true,
        unique:true,
        lowercase:true

    },
    gender:{
        type:String,
        trim:true,
        lowercase:true,
        required:true
    },
    date_of_barth:{
        type:Date,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    countary_code:{
        type:Number
    }
})
let userec = mongoose.model("userEc", userSchema)
export default userec