import fs from 'fs';
function deleteUser(req,res){
    try{
        const id = Number(req.params.id);
        if(!id){
            return res.status(400).send("id is requrired");
        }
        if(fs.existsSync("Employee.json")){
            const data =  JSON.parse(fs.readFileSync("Employee.json","utf-8"));
            const isUser = data.filter(a => a.id != id );
            if(!isUser){
                return res.status(404).send("Employee not Found");
            }

            fs.writeFileSync("Employee.json", JSON.stringify(isUser, null, 2));
            res.redirect("/");
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server error");
    }

}
export default deleteUser;