import express from "express";
import mongoose, { connect } from "mongoose";
let app = express()
let port  = 8083

mongoose.connect('mongodb://localhost:27017/Anuj')
.then(()=>console.log("mongoose connect"))
.catch(err => console.log(err));
app.get("/user",(req,res)=>{
   res.send(req.body)
 })

app.listen(port, ()=>{
    console.log("connect server")
})