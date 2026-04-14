import bcrypt from "bcrypt";
import {StatusCodes} from "http-status-pro-js"

import{usercreate} from "../model/user.model.js"


function usersignup( req, res){
    console.log( " usersignup", req.body);
    try {
        let {name, email, password} = req.body
        let salt = bcrypt.genSaltSync(10);
        let hasPassword = bcrypt.hashSync(password, salt);
        password = hasPassword;
        let data = usercreate(name, email, password)
        if(!data){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
                code:StatusCodes.INTERNAL_SERVER_ERROR.code,
                message:StatusCodes.INTERNAL_SERVER_ERROR.message,
                data:null
            })
            return;
        }
        res.status(StatusCodes.OK.code).json({
            code:StatusCodes.OK.code,
            message:StatusCodes.OK.message,
            data:data
        })
       
    } catch (error) {

        console.log("user signup", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null

        })
       
    }

}

export default usersignup