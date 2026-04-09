import fs from 'fs';
function listPost(req,res){
    try{
        let {user} = req.body;
        if(!user){
            return res.status(400).send("all fields required");
        }
        if(!fs.existsSync("user.json")){
            return res.status(404).send("No Post found");
        }
        let data = fs.readFileSync("user.json","utf-8");
        let parseData = JSON.parse(data);
        let isUser = parseData.filter(a=>a.user===user)
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
export default listPost;