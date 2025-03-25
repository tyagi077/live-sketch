import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function middleware(req:Request,res:Response,next:NextFunction){
   
  try{
    const authorization = req.headers["authorization"] ??"";
    if(!authorization){
        res.status(401).json({
            message:"Login first"
        })
    }
    const token = authorization.split(' ')[1];
    if(!token){
        res.status(401).json({
            message:"Unauthorized"
        })
    }else{
    const decoded = jwt.verify(token,JWT_SECRET)

    if(decoded){
        //@ts-ignore 
        req.userId=decoded.userId;
        next()
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}
  }catch(error){
    res.json({
        status:false,
        message:"unauthorized"
    })
  }
}