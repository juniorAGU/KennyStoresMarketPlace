import mongoose from "mongoose";
import { Schema } from "mongoose";

const reset = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

export const ResetRequest = mongoose.model("ResetRequest", reset)