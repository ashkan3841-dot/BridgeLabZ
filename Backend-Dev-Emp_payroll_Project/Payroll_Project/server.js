//dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';

//Scripts
import createEmployee from "./modules/createEmployee.js";
import deleteEmployee from "./modules/deleteEmployee.js";
import updateEmployee from "./modules/updateEmployee.js";
import readEmployee from "./modules/readFile.js";
import auth from "./modules/auth2.js"


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.set('view engine','ejs');
// testing

let port = process.env.PORT || 8001
app.get("/",(req,res)=>{
    const data = fs.readFileSync("./Employee.json","utf-8");
    const parsedData = JSON.parse(data);
    res.render('list',{data: parsedData});
})
app.get("/employee", (req, res) => {
  res.render("add");
});
app.get("/corrected/:id", (req, res) => {
    let id = req.params.id;
    id = Number(id.slice(1));
    console.log(id)
    const data = JSON.parse(
        fs.readFileSync("Employee.json", "utf-8")
    );
    const user = data.find(a => a.id === id);
    if (!user) {
        return res.send("User not found");
    }
    res.render("update", { user });

});
//running scripts
app.post("/employee",createEmployee);
app.post("/update/:id",updateEmployee);
app.post("/delete/:id",deleteEmployee);
app.post("/search",readEmployee);

//checking connection
app.listen(port, ()=>{
    console.log("Server Connected on the port");
})
