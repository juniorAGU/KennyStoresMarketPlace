import { Order } from "../models/orders.js"

const autoConfirmDelivery = async (req,res,next) => {
    try{

        const sevenDays = new Date(Date.now() - 7 * 24 * 60 * 60 * 100);

        const result =  await Order.updateMany(
            {
                status: "shipped",
                updatedAt: {$lt : sevenDays},
                'dispute.status': { $ne: 'open' }
            },
            {
                status: "delivered"
            }
        );

        return result.modifiedCount; 

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export { autoConfirmDelivery}