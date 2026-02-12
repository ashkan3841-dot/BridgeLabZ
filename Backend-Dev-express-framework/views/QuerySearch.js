import fs from "fs"
import {StatusCodes} from "http-status-pro-js";

function search(req,res) {
    try{
    let searchQuery = req.query.name;
    if(!fs.existsSync("userData.json")){
        return res.status(StatusCodes.BAD_REQUEST.code).json({
            code:StatusCodes.BAD_REQUEST.code,
            message:StatusCodes.BAD_REQUEST.message,
            data:null
        })
    }
    let data = JSON.parse(fs.readFileSync("userData.json","utf-8"));
    let ReqUsers = data.filter((value)=>value.name === searchQuery);
    return res.send(JSON.stringify(ReqUsers,null,2));

   }catch(err){
    console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
        code:StatusCodes.INTERNAL_SERVER_ERROR.code,
        message:StatusCodes.INTERNAL_SERVER_ERROR.message,
        data:null
      })
   }
}

export default search