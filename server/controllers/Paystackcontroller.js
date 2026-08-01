import { webHookVerification } from "../Services/PaystackService.js";
import { Order } from "../models/orders.js";
import { Payout } from "../models/Payout.js";

const PaystackwebHook = async (req,res,next) => {
    try{
        const signature = req.headers['x-paystack-signature'];

        if(!signature || !webHookVerification(req.body, signature)){
            return res.status(400).send('Invalid signature');
        };

        const event = req.body;
        
        if(event.event === 'charge.success'){
            const reference = event.data.reference;
            await Order.updateMany({
                paymentReference: reference,
                status: 'paid'
            })
        }

        if(event.event === 'transfer.success'){
            const reference = event.data.reference;
            await Payout.findOneAndUpdate({
                paymentRef: reference,
                status: 'completed'
            })

        }

        if(event.event === 'transfer.failed'){
            const reference = event.data.reference;
            await Payout.findOneAndUpdate({
                paymentRef: reference,
                status: 'failed'
            });
        }

        res.sendStatus(200);

    }catch(err){
        console.log("webHook Error",err),
        res.sendStatus(200);
        
    }
}

export { PaystackwebHook}