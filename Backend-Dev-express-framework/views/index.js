import express from "express"
import dotenv from "dotenv"
import search from "./QuerySearch.js"
import responseTimeLogger from "./LogResponse.js";

dotenv.config();
let app = express();
app.use(express());

app.get("/search",search)

//test for responsetimelogger function
app.get("/testforget",responseTimeLogger,(req,res)=>{
    res.send("successfully logged get response time");
})

app.set("view engine","ejs");

app.get("/form",(req, res)=>{
    res.render("form");
});

app.post("/form",(req,res)=>{
    let body = "";

    req.on("data",chunk =>{
        body += chunk.toString();
    });

    req.on("end",()=>{
        const formData = new URLSearchParams(body);

        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("password");

        console.log(name, email, message);

        res.render("success",{name});
    });
});
app.listen(process.env.PORT,()=>{
    console.log("Connected to server");
})