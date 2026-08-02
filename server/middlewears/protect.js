import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const protect = async (req, res, next) => {
    try{
        
        let token = req.cookies.token;

        if(!token){
            token = req.headers.authorization?.split(' ')[1];
        }

        if(!token){
            return res.status(400).json({
                success: false,
                message: "User is not allowed"
            })
        };

        const validate = await jwt.verify(token,process.env.JWT_TOKEN);


        const user = await User.findById(validate.userId).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found or Exist",
            });
        };

        req.user = user

        next()
    }catch(err){
        console.log("Auth middlewear Error",err)
        return res.status(401).json({
            success: false,
            message: "Access denied, Expired Token"
        })
    }
}

export default protect