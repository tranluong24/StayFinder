import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//Mo rong kieu du lieu Request
declare global{
    namespace Express{
        interface Request{
            userId: string
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.cookies["auth_token"]
    if(!token){
        res.status(401).json({
            message:"unauthorized"
        })
    }else{
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
            req.userId = (decoded as JwtPayload).userId
            next()

        }catch(error){
            res.status(401).json({
                message:"unauthorized"
            })
        }
    }
}

export default verifyToken