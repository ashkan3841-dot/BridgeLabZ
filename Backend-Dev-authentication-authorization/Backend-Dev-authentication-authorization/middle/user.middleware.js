import joi from "joi";
import {StatusCodes} from "http-status-pro-js"

function usermidd(req, res, next){
    try {
         let scheam = joi.object({
            Name:joi.string().trim().min(5).max(20).required(),
            email:joi.string().trim().lowercase().min(6).max(200).required(),
             passward:joi.string().trim().min(5).max(10).required()
         })
         let {error, value} = scheam.validate(req.body)
         if(error){
            res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:error.message,
                data:null
            })
            return;
         }
        req.body = value;
        next()
    } catch (error) {
        console.log("user mid", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
        return
       
    }

}
export default usermidd