import mongoose from "mongoose";
import { Schema } from 'mongoose';

const payoutSchema = new Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending','proccessing','completed','failed'],
        default: 'pending'
    },
    paymentRef: {
        type: String,
        default: null
    },
    requestedAt: Date,
    proccessedAt: Date,
},{timestamps: Date});

export const Payout = mongoose.model("Payout", payoutSchema);