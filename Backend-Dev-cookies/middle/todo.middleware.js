import joi from "joi"
import { StatusCodes } from "http-status-pro-js"

function todomid(req,res,next){
    try {
        let Schema = joi.object({
            title:joi.string().trim().min(10).max(50).required(),
            desp:joi.string().trim().min(20).max(70).required(),
        })
        let {error, value} = Schema.validate(req.body)
        if(error){
            res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:error.message,
                data:null
            })
            return
        }
        req.body = value;
        next()
    } catch (error) {
        console.log("todomidd",error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
        return

        
    }
}
export default todomid