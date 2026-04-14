import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt";
 import {StatusCodes} from "http-status-pro-js"

 function userloggingservice(req, res){
    try {
        let{email, password} = req.body;
        let data = userlogindb(email)
        if(!data){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
                code:StatusCodes.INTERNAL_SERVER_ERROR.code,
                message:StatusCodes.INTERNAL_SERVER_ERROR.message,
                data:null
            })
            return;
        }
        let isuser = bcrypt.compareSync(password, data.password)
        if(!isuser){
              res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
                code:StatusCodes.INTERNAL_SERVER_ERROR.code,
                message:StatusCodes.INTERNAL_SERVER_ERROR.message,
                data:null
            })
            return;
        }
        let token = jwt.sign({id:data.id}, process.env.TOKEN, {expiresIn:"24h"})
        res.status(StatusCodes.OK.code).json({
            code:StatusCodes.OK.code,
            message:StatusCodes.OK.message,
            data:{email:data.email, token:token}
        })  
    } catch (error) {
        console.log("usreloginservice", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
       
       
    }
 }

 export default userloggingservice;