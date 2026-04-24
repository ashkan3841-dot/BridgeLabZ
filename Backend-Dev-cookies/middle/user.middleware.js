import joi from "joi"
import { StatusCodes } from "http-status-pro-js"

function usermidd(req,res,next){
    try {
        let Schema = joi.object({
            name:joi.string().trim().min(5).max(200).required(),
            email:joi.string().trim().email().min(6).max(40).lowercase().required(),
            password:joi.string().trim().min(6).max(8).required()
        })
        let {error, value} = Schema.validate(req.body)
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
        console.log("usermid",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
        return
        
    }
}
export default usermidd