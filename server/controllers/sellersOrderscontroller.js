import { Order } from "../models/orders.js";
import sanitize from "mongo-sanitize";
import { autoConfirmDelivery } from "../utils/autodelivery.js";
import { Products } from "../models/Product.js";

const GetsellersOrder = async (req,res,next) => {
    try{
        await autoConfirmDelivery();

        const orders = await Order.find({seller: req.user._id});

        if(!orders){
            return res.status(404).json({
                success: false,
                message: "No Orders Available"
            });
        };

        res.status(200).json({
            success: true,
            message: "successful",
            orders
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server issues"
        })
    }
}

const UpdateOrderstatus = async (req, res, next) => {
    try{
        const cleaned = sanitize(req.body);

        const orderId = req.params.orderId;

        const sellerId =  req.user._id;

        const { status, trackingNumber } = cleaned

        if(!status){
            return res.status(400).json({
                success: false,
                message: "input must not be empty"
            })
        }

        const orders = await Order.findOne({_id: orderId, seller: sellerId});

        if(!orders){
            return res.status(404).json({
                success: false,
                message: "orders not Found"
            });
        };

        if(orders.status !== "paid" || status !== "shipped"){
            return res.status(400).json({
                success: false,
                message: "Can only ship a paid order"
            });
        };

        orders.status = status;
        orders.trackingNumber = trackingNumber
        await orders.save();

        res.status(200).json({
            success: true,
            message: "successfull",
            orders
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    }
}

const resolveDispute = async (req,res,next) => {
    try{

        const orderId = req.params.orderId;
        
        const cleaned = sanitize(req.body);

        const { resolution } = cleaned;

        const order = await Order.findOne({_id: orderId, seller: req.user._id });

        if(!order || order?.dispute?.status !== "open"){
            return res.status(404).json({
                success: false,
                message: "order is not Found"
            });
        };

        order.dispute.status = resolution;
        order.dispute.resolvedAt = new Date();

        if(resolution === "resolved"){
            order.status = "shipped";
            order.updatedAt = new Date();
        }

        if(resolution === "refunded"){
            order.status = "cancelled";

            for(const item of order.items){
                await Products.findByIdAndUpdate(item.product, {
                    $inc: {quantity: item.quantity}
                })
            }
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "successful"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server issues"
        })
    }

}

export { GetsellersOrder,UpdateOrderstatus, resolveDispute}