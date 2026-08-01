import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import sanitizer from 'mongo-sanitize';
import { Upload, UploadToCloudinary } from '../CloudinaryConfig/cloudinary.js';
import { recipiantFund } from '../Services/PaystackService.js';

const CreateUser = async (req, res, next ) => {
    try{
        const cleaned = sanitizer(req.body)
        const {name, email, password, accountType} = cleaned;
        
        
        if(!name || !email || !password || !accountType){
            return res.status(400).json({
                success: false,
                message: "inputs must not be empty"
            });
        }

        const checkExist = await User.findOne({email});

        if(checkExist){
            return res.status(400).json({
                success: false,
                message: "Account Already Existed",
            })
        }

        const hashed = await bcrypt.hash(password,10);

        const newUser =  await User.create({
            name,
            email,
            accountType,
            password: hashed,
            role: "user",
            subscription: "free",
            createdAt: Date.now()
        });

        const token = await jwt.sign(
            {userId: newUser._id, email: newUser.email, role: newUser.role},
            process.env.JWT_TOKEN,
            {expiresIn: process.env.EXPIRESIN}
        );

        const oneDayInMs = 24 * 60 * 60 * 1000; 

        res.cookie("token", token ,{
            httpOnly: true,
            maxAge: oneDayInMs,
            secure: false,
            samSite: "lax"
        });


        res.status(200).json({
            success: true,
            message: "successfull",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                accountType: newUser.accountType  
            }
        });



    }catch(err){
        return console.log(err)
    }

}

const UpdateUser = async(req,res,next) => {
    try{

        const userId = req.user._id;

        const cleaned = sanitizer(req.body);

        const {  bio, title, name, location, phone,email, accountNumber, accountName,bankcode} = cleaned;

        if( !bio || !title || !name || !location || !phone || !email ){
            return res.status(400).json({
                success: false,
                message: "Inputs must not be Empty"
            });
        };
        

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Image not Recognised"
            });
        };

        const cloudinaryResult = await UploadToCloudinary(req.file.buffer);

        const image = cloudinaryResult.secure_url;
        

        const findAndUpdate = {
            name,
            bio,
            title,
            email,
            phone,
            location
        };

        if(image){findAndUpdate.image = image};
        if(accountName){findAndUpdate.accountName = accountName};
        if(accountNumber){findAndUpdate.accountNumber = accountNumber};
        if(bankcode){findAndUpdate.bankCode = bankcode}

        const findUpdate = await User.findByIdAndUpdate(
            userId,
            findAndUpdate,
        ).lean();
        

        if(accountName && accountNumber && bankcode){

            const seller = await User.findById(userId);
        
            const response = await recipiantFund(seller.accountName,seller.accountNumber,seller.bankCode); 

            seller.paystackRecipientCode = response.data.recipient_code;

            await seller.save();
        }


        res.status(200).json({
            success: true,
            message: "Successfull",
            user: findUpdate
        })


    }catch(err){
        console.log("updating user Error",err)
        return res.status(500).json({
            success: false,
            message: "Internal Server issue ,User not Updated"
        })
    }

}

const SwitchAcc = async (req,res,next) => {
    try{
        const userId = req.user._id;
        
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        };

        const newAccoutType =  user.accountType === 'buyer' ? 'seller' : 'buyer';

        user.accountType = newAccoutType
        await user.save();

        res.status(200).json({
            success: true,
            message: 'successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountType: user.accountType
            }
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "internal server Error",
        })
    }
}

const update = async (req,res,next) => {
    try{
        const cleaned = sanitizer(req.body);

        const userId = req.user._id;

        const {newData, oldData} = cleaned;

        if(!newData || !oldData){
            return res.status(400).json({
                success: false,
                message: "Bad user data"
            });
        };

        const user = await User.findById(userId);

        const formerPassword = user.password

        const ismatch = await bcrypt.compare(oldData, formerPassword);

        if(!ismatch){
            return res.status(400).json({
                success: false,
                message: "incorrect password"
            });
        };

        const hashed = await bcrypt.hash(newData,10);

        user.password = hashed;
        await user.save();

        res.status(200).json({
            success: true,
            message: "successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountType: user.accountType
            }
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "internal sever Error"
        })
    }
}

const GetUser = async (req,res,next) => {
    try{}catch(err){
        return console.log(err)
    }
}

export { CreateUser, GetUser, UpdateUser, SwitchAcc, update}