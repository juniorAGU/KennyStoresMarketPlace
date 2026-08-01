import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true
        },
        name: String,
        image: String,
        quantity: Number,
        price: Number,
        shippingFee : {
            type: Number,
            default: 0
        }
    }],
    shippingAddress: {
        name: { 
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: "pending"
    },
    trackingNumber: {
        type: String,
        default: null
    },
    dispute: {
        status: {
            type: String,
            enum: ['none', 'open', 'resolved', 'refunded'],
            default: 'none'
        },
        reason: String,
        createdAt: Date,
        resolvedAt: Date
    },
    paymentReference: {
        type: String,
        default: null
    },
    refundReference: {
        type: String,
        default: null
    },
    commission: {
        type: Number,
        default: 0
    },
    sellerEarning: {
        type: Number,
        default: 0
    },
    refundAmount : {
        type: Number,
        default: null
    },
    paymentUrl : {
        type: String,
        default: null
    }
},{timestamps: true});

export const Order = mongoose.model("Order", orderSchema)