import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { LoginAudit } from '../models/Auditlogs.js';
import sanitizer from 'mongo-sanitize';


const CreatOneLog = async (req, res, next) => {

    const IpAddress = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const UserAgent = req.headers["user-agent"] || "unkown"
    try{
        const cleaned = sanitizer(req.body)
        const { email, password} = cleaned;

        if(!email || !password){

            await LoginAudit.create({
                attemptedEmail: email,
                status: 'failed',
                reasons: "invalid password and email",
                ipadress: IpAddress,
                userAgent: UserAgent
            })
            return res.status(400).json({
                success: false,
                message: "inputs must not be Empty",
            })
        }

        const checkExistence = await User.findOne({email});

        if(!checkExistence){

            await LoginAudit.create({
                attemptedEmail: email,
                status: 'failed',
                reasons: "Account not found",
                ipadress: IpAddress,
                userAgent: UserAgent
            });

            return res.status(404).json({
                success: false,
                message: "Not found"
            })
        }

        const isMatch = await bcrypt.compare(password,checkExistence.password);

        if(!isMatch){

            await LoginAudit.create({
                attemptedEmail: email,
                status: 'failed',
                reasons: "Password does not match",
                ipadress: IpAddress,
                userAgent: UserAgent
            });

            return res.status(400).json({
                success: false,
                message: "password does not match "
            })
        }

        const token = await jwt.sign(
            {userId: checkExistence._id, email: checkExistence.email,role: checkExistence.role},
            process.env.JWT_TOKEN,
            {expiresIn: process.env.EXPIRESIN}
        );

        const oneDayInMs = 24 * 60 * 60 * 1000; 
        res.cookie("token", token ,{
            httpOnly: true,
            maxAge: oneDayInMs,
            secure: true,
            sameSite: "none"
        });

        await LoginAudit.create({
            attemptedEmail: email,
            status: 'success',
            ipadress: IpAddress,
            userAgent: UserAgent
        });

        const { password: hashedPassword, ...rest} = checkExistence.toObject();

        res.status(200).json({
            success: true,
            message: "successful",
            user: {
                id: rest._id,
                ...rest
            },
            token
        })
    }catch(err){
        return console.log(err)
    }
}

export { CreatOneLog }