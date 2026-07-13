import { Order } from "../models/orders.js";
import { Cart } from "../models/cart.js";
import { Products } from "../models/Product.js";
import sanitize from "mongo-sanitize";
import { populate } from "dotenv";
import { initializePayment, verifyPayment } from "../Services/PaystackService.js";
import { autoConfirmDelivery } from "../utils/autodelivery.js";

const CreateOrder = async (req,res,next) => {
    try{
        const cleaned = sanitize(req.body);

        const { shippingAddress } = cleaned;

        if(!shippingAddress.phone || !shippingAddress.address || !shippingAddress.name){
            return res.status(400).json({
                success: false,
                message: "inputs must not be empty"
            })
        }
        
        const userId = req.user._id;
        const userEmail = req.user.email;

        const cart =  await Cart.findOne({user: userId}).populate({path: "items.product", select: 'name images price seller shippingFee', populate: {path: "seller", select: "name"}});
        console.log("Product shippingFee:", cart.items[0]?.product?.shippingFee);

        if(!cart || cart.items.length === 0){
            return res.status(404).json({
                success: false,
                message: "cart is Empty"
            });
        };

        const groupSeller = {};
        

        cart.items.forEach(item => {
            const sellerId = item.product.seller._id.toString();
            if(!groupSeller[sellerId]){
                groupSeller[sellerId] = [];
            }
            groupSeller[sellerId].push({
                product: item.product._id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                image: item.product?.images?.[0],
                shippingFee: item.product?.shippingFee || 0
            });
        });

        const orders = [];
        let grandTotal = 0;
        

        for(const [sellerId, items] of Object.entries(groupSeller)){
            const totalAmount = items.reduce((sum,pro) => sum + (pro.price * pro.quantity) + (pro?.shippingFee || 0),0);
            grandTotal += totalAmount

            const order = await Order.create({
                seller: sellerId,
                buyer: userId,
                items,
                shippingAddress,
                totalAmount,
                status: "pending",
            });

            orders.push(order)
        }

        const orderIds = orders.map(o => o._id.toString()).join(',')

        const initpay = await initializePayment(userEmail,grandTotal,userId, orderIds)


        const { authorization_url, reference } = initpay.data;

        await Order.findByIdAndUpdate(orderIds, {paymentUrl: authorization_url})


        res.status(200).json({
            success: true,
            message: "successful, Order created, Proceed to paymenty",
            authorization_url,
            reference,
            orders: orders
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Issues"
        });
    };
};

const verifyOrders = async (req,res,next) => {

    try{

        const {reference} = req.params;
        console.log("ref",reference)

        if (!reference || reference === 'null') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment reference' 
            });
        }

        const verification = await verifyPayment(reference);
        

        const {status, metadata, amount } = verification.data;

        console.log("status",status, "metadata", metadata, "amount", amount)

        if(status !== "success"){
            return res.status(400).json({
                success: false,
                message: "payment was not successful"
            })
        }
        const orderIds = metadata.ordersIds.split(',');
        const userId = metadata.userId;

        await Order.updateMany({_id: {$in: orderIds}}, {status: "paid"});

        const cart = await Cart.findOne({user: userId}).populate("items.product");

        if(cart){
            for(const item of cart.items){
                await Products.findByIdAndUpdate(item.product._id,{$inc: {quantity: -item.quantity}})
            }

            await Cart.findOneAndDelete({user: userId})
        }

        res.status(200).json({
            success: true,
            message: "successful",
            payedAmount: amount / 100,
            orderIds
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    }
};

const CreateDispute = async(req,res,next) => {
    try{
        const cleaned = sanitize(req.body);

        const orderId = req.params.orderId;

        const { reason} = cleaned

        const order = await Order.findOne({_id: orderId, buyer: req.user._id});

        if(!order){
            return res.status(404).json({
                success: false,
                message: "order not found"
            });
        };

        if(order.status !== "shipped"){
            return  res.status(400).json({
                success: false,
                message: "can only Dispute for shipped Product"
            });
        };

        order.dispute = {
            status: "open",
            reason,
            createdAt: new Date()
        };

        await order.save();

        res.status(200).json({
            success: true,
            message: "successful"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Issues"
        });
    };
}

const getOrders = async (req,res,next) => {
    try{
        const userId = req.user._id;

        await autoConfirmDelivery();

        const orders = await Order.find({buyer: userId}).populate({path:"items.product", select: 'name images', populate: {path: "seller", select: "name"}}).sort({createdAt: -1}).lean();

        if(!orders || orders.length === 0){
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }


        res.status(200).json({
            success: true,
            orders
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    }
};

const getSpecificOrder = async (req,res,next) => {
    try{

        const orderId = req.params.orderId;

        const userId  = req.user._id;

        const findOrders =  await Order.findOne({_id: orderId, buyer: userId})
                            .populate({path: "items.product", select : "name images", populate: {path: "seller", select: "name"}})
                            .populate("seller", "name")
                            .lean();

        if(!findOrders){
            return res.status(404).json({
                success: false,
                message: "orders not found"
            });
        };

        res.status(200).json({
            success: true,
            message: "successful",
            order: findOrders
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    }
}
export{verifyOrders, CreateOrder, CreateDispute, getOrders,getSpecificOrder}