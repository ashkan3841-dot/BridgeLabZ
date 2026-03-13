import fs from 'fs';
function individualPost(req,res){
    try{
        let {id} = req.body;
        id = Number(id);
        if(!id){
            return res.status(400).send("all fields required");
        }
        console.log(id);
        if(!fs.existsSync("Employee.json")){
            return res.status(404).send("No Post found");
        }
        let data = fs.readFileSync("Employee.json","utf-8");
        let parseData = JSON.parse(data);
        let isUser = parseData.filter(a=>a.id===id)
        console.log(isUser);
        if(!isUser){
            return res.status(404).send("User not Found");
        }
        res.status(201).send(isUser);
        
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
export default individualPost;