import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/auth';
import { randomInt } from 'crypto';

const router = express.Router()

router.post("/login",[
    check("email", "Email is required").isEmail(),
    check("password", "Passwod with 8 or more characters required").isLength({
        min: 8,
    }),
], async (req: Request, res:Response) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({
            message: errors.array()
        })
    }else{
        const {email,password} = req.body

        try{
           const user = await User.findOne({email})
           if(!user){
            res.status(400).json({
                message: "Invalid Credentials"
            })
            }else{
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch){
                    res.status(400).json({
                        message: "Invalid Credentials"
                    })
                }else{
                    const token = jwt.sign({userId: user.id}, 
                        process.env.JWT_SECRET_KEY as string,
                        {expiresIn: "1d",}
                    )

                    res.cookie("auth_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENT === "production",
                        maxAge: 86400000,
                    })

                    res.status(200).json({
                        // userId: user._id,
                        message: "Login successfully",
                    })
                }
            }
        }catch (error){
            console.log(error)
            res.status(500).json({
                message: "Something went wrong"
            })
        }
    }
}
)
//Xac thuc cookie cho phien dang nhap hien tai
//De biet la co dang dang nhap hay khong
router.get("/validate-token", verifyToken, async (req: Request, res: Response)=>{
    const userId = req.userId
    const user = await User.findById(userId)
    if(!user){
        res.status(404).send({message: "User not found !"})
    }else{
        res.status(200).send({
            userId: userId,
            role:user.role,
            name: user.lastName
        })
    }
})

router.post("/logout", (req:Request, res: Response)=>{
    res.cookie("auth_token", "", {
        expires: new Date (0),
    })

    res.send({
        message:"Sign Out Done !"
    })
})

export default router
