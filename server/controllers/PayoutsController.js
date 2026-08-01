import { Payout } from "../models/Payout.js";
import { Order } from "../models/orders.js";
import sanitize from "mongo-sanitize";
import { transferResponse,bankNames } from "../Services/PaystackService.js";
import { User } from "../models/User.js";

const createPayout = async (req,res,next) => {
    try{
        const sellerId = req.user._id;

        const cleaned = sanitize(req.body);

        const { amount } = cleaned;

        if(!amount || amount <= 0 ){
            return res.status(400).json({
                success: false,
                message: "Bad Data"
            });
        };

        const toatalEarned = await Order.aggregate([
            {$match: {seller: sellerId, status:  'delivered'}},
            {$group: {_id: null, total: {$sum: '$totalAmount'}}}
        ]);

        const withdrawn = await Payout.aggregate([
            {$match: {seller: sellerId, status: {$in: ['completed','processing']}}},
            {$group: {_id: null, total: {$sum: '$amount'}}}
        ])

        const pendingPayout = await Order.aggregate([
            {$match: {seller: sellerId, status: {$in: ['paid', 'shipped']}}},
            {$group:  {_id: null, total: {$sum: '$totalAmount'}}}
        ])

        const earning = toatalEarned[0]?.total || 0;
        const alreadyWithdrawn = withdrawn[0]?.total || 0;
        const pendingMoney = pendingPayout[0]?.total || 0;
        
        const avaliableBalance = earning - alreadyWithdrawn;

        if(amount > avaliableBalance){
            return res.status(400).json({
                success: false,
                message: "insufficient  avalaible balance"
            });
        };

        const seller = await User.findById(sellerId);
        if (!seller.paystackRecipientCode) {
            return res.status(400).json({
                success: false,
                message: "Please add your bank details before requesting a withdrawal"
            });
        }

        const payout = await Payout.create({
            seller: sellerId,
            amount,
            status: 'completed',
            paymentRef: `SIM-${Date.now()}`
        });

        
        // const sellerCode =  seller.paystackRecipientCode;


        // const respons =  await transferResponse(sellerId,amount,sellerCode);

        // payout.paymentRef = `SIM-${Date.now()}`;
        // payout.status = respons.data.status === 'success' ? 'completed' : 'processing';

        await payout.save();

        res.status(200).json({
            success: true,
            message: "Payout issued successfully",
            payout,
            alreadyWithdrawn,
            earning,
            avaliableBalance,
            pendingMoney
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server problem"
        })
    }
};
const getPayout = async (req,res,next) => {
    try{

        const sellerId = req.user._id;

        const toatalEarned = await Order.aggregate([
            {$match: {seller: sellerId, status:  'delivered'}},
            {$group: {_id: null, total: {$sum: '$totalAmount'}}}
        ]);

        const withdrawn = await Payout.aggregate([
            {$match: {seller: sellerId, status: {$in: ['completed','processing']}}},
            {$group: {_id: null, total: {$sum: '$amount'}}}
        ])

        const pendingPayout = await Order.aggregate([
            {$match: {seller: sellerId, status: {$in: ['paid', 'shipped']}}},
            {$group:  {_id: null, total: {$sum: '$totalAmount'}}}
        ])

        const earning = toatalEarned[0]?.total || 0;
        const alreadyWithdrawn = withdrawn[0]?.total || 0;
        const pendingMoney = pendingPayout[0]?.total || 0;
        
        const avaliableBalance = earning - alreadyWithdrawn;

        const payouts = await Payout.find({seller: sellerId})
                    .sort({createdAt: -1})
                    .limit(10)
                    .lean();

        res.status(200).json({
            success: true,
            message: payouts.length ? "Successful" : "No payouts yet",
            payouts,
            alreadyWithdrawn,
            earning,
            avaliableBalance,
            pendingMoney
        })
    }catch(err){
        console.log(err)
        return res.staus(500).json({
            success: false,
            message: "internal server problem"
        })
    }
}

const getBanks = async (req,res,next) => {
    try{

        const response = await bankNames();

        const banks =  response.data;

        res.status(200).json({
            success: true,
            message: "successful",
            banks
        })

    }catch(err){
        console.log(err)
        return res.staus(500).json({
            success: false,
            message: "internal server problem"
        })
    }
};
export {createPayout,getPayout, getBanks}