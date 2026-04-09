import fs from 'fs';
function deleteUser(req,res){
    try{
        const{id} = req.params
        if(!id){
            return res.status(400).send("id is   requrired");
        }
        if(fs.existsSync("user.json")){
            const data =  JSON.parse(fs.readFileSync("user.json","utf-8"));
            const isUser = data.filter(a => a.id != id );
            if(!isUser){
                return res.status(404).send("User not Found");
            }

            fs.writeFileSync("user.json", JSON.stringify(isUser, null, 2));
            res.status(200).send("User deleted ")
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send("Server error");
    }

}
export default deleteUser;