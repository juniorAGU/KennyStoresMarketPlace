import { User } from "../models/User.js";
import sanitize from "mongo-sanitize";
import { sendEmail } from "../Services/Emailservice.js";
import { ResetRequest } from "../models/reset.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'

const forgotPassword = async (req,res,next) => {
    try{
        const cleaned = sanitize(req.body);
        

        const { email } = cleaned;

        if(!email){
            return res.status(400).json({
                success: false,
                message: "input must not be Empty"
            });
        };

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "user is not found"
            });
        };

        await ResetRequest.deleteMany();


        const token = crypto.randomBytes(30).toString('hex')

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await ResetRequest.create({
            token,
            email,
            otp,
            expireAt: new Date(Date.now() + 3 * 60 * 1000)
        })

        await sendEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "Check your Email for an OTP code",
            token
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server issue"
        })
    }
}

const verifyPasswordOtp = async (req,res,next) => {
    try{
        const cleaned =  sanitize(req.body);

        const { token, otp} = cleaned;

        if(!token || !otp){
            return res.status(400).json({
                success: false,
                message: "code is required"
            });
        };

        const reset = await ResetRequest.findOne({
            token,
            otp,
            expireAt: {$gt: Date.now()},
            verified: false
        });

        if(!reset){
            return res.status(400).json({
                success: false,
                message: "invalide Otp"
            });
        };

        reset.verified = true;
        await reset.save();

        const resetToken = crypto.randomBytes(30).toString('hex');

        reset.token = resetToken
        reset.expireAt = new Date(Date.now() + 10 * 60 * 1000);

        await reset.save();

        res.status(200).json({
            success: true,
            message: "successfull",
            resetToken
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

const resetPasswordOtp = async (req,res,next) => {
    try{
        const cleaned = sanitize(req.body);

        const { token, password} = cleaned;


        if(!token || !password){
            return res.status(400).json({
                success: false,
                message: "token and password are required "
            });
        };

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "password must be more than 6 numbers"
            });
        };

        const reset = await ResetRequest.findOne({
            token,
            expireAt: {$gt: new Date()},
            verified: true
        });

        if(!reset){
            return res.status(400).json({
                success: false,
                message: "expired or invalid token"
            });
        };

        const user = await User.findOne({email: reset.email});

        user.password = await bcrypt.hash(password,10);

        await user.save()

        await ResetRequest.deleteOne({_id: reset._id});

        res.status(200).json({
            success: true,
            message: "password reset successfully"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'internal server issue'
        })
    }
} 

export { forgotPassword, verifyPasswordOtp, resetPasswordOtp}