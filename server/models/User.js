import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlenght: [8, "password must be atleast 6"]
    },
    accountType: {
        type: String,
        required: true,
        enum: ["seller", "buyer"],
        default: "seller"
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowerCase: true
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "default-avatar.png",
    },
    bio: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager"],
        default: "user"
    },
    paystackRecipientCode: {
        type: String,
        default: null
    },
    accountNumber: {
        type: String,
    },
    bankCode: {
        type: String,
    },
    accountName: {
        type: String,
    },
    department: {
        type: String,
        required: true,
        default: " ICT Department"
    },
    subscription: {
        type: String,
        required: true,
        enum: ["free","pro", "promax"],
        default: "free"
    },
    clearance: {
        type: Number,
        required: true,
        default: 1
    },
    resetOTP: {
        code: String,
        expiresAt: Date
    },
    resetToken: {
        token: String,
        expiresAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const User = mongoose.model("User",userSchema)