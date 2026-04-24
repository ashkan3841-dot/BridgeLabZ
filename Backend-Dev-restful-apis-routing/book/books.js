
import fs from "fs";
import { StatusCodes } from "http-status-pro-js";

export function createBook(req,res){
    const{title, author, year} = req.body;

    let arr = [];
    let obj = {
        id:Date.now(),title, author, year
    }
    try{
        if(fs.existsSync("book.json")){
            let data = JSON.parse(fs.readFileSync("book.json","utf-8"));
            let isBook = data.find((value)=> value.title===title);
            if(isBook){
                return res.status(StatusCodes.CONFLICT.code).json({
            code:StatusCodes.CONFLICT.code,
            message:StatusCodes.CONFLICT.message,
            data:null
            })
        }
        arr = data;

    }
    arr.push(obj);
    fs.writeFileSync("book.json",JSON.stringify(arr,null,2));
    res.status(StatusCodes.CREATED.code).json({
        code:StatusCodes.CREATED.code,
        message:StatusCodes.CREATED.message,
        data:obj
    })
}catch(err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}

// filtering by author name

export function filtering(req,res){
    const{author} = req.query;
    try{
        if(!fs.existsSync("book.json")){
            return res.status(StatusCodes.NOT_FOUND.code).json({
        code:StatusCodes.NOT_FOUND.code,
        message:StatusCodes.NOT_FOUND.message,
        data:obj
    })
        }
        let data = JSON.parse(fs.readFileSync("book.json","utf-8"));
        let isBook = data.find((value)=> value.author===author);
        if(!isBook){
            return res.status(StatusCodes.NOT_FOUND.code).json({
        code:StatusCodes.NOT_FOUND.code,
        message:StatusCodes.NOT_FOUND.message,
        data:null
    })
        }
        let books = data.filter((value)=> value.author===author);
        return res.status(StatusCodes.OK.code).json({
        code:StatusCodes.OK.code,
        message:StatusCodes.OK.message,
        data:books
    })

    }catch(err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}

export function searchByTitle(req,res){
    const{title} = req.query;
    try{
        if(!fs.existsSync("book.json")){
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code:StatusCodes.NOT_FOUND.code,
                message:StatusCodes.NOT_FOUND.message,
                data:null
            })
        }
        let data = JSON.parse(fs.readFileSync("book.json","utf-8"));
        let books = data.filter((value)=> value.title==title);
        return res.status(StatusCodes.OK.code).json({
            code:StatusCodes.OK.code,
            message:StatusCodes.OK.message,
            data:books
        })
    }catch(err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}
