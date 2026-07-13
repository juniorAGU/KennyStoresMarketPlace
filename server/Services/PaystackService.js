import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const initializePayment = async (userEmail, grandTotal,userId,ordersIds) => {
    const response = await axios.post("https://api.paystack.co/transaction/initialize", {
        email: userEmail,
        amount: grandTotal * 100,
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
            ordersIds,
            userId: userId.toString()
        }
    },{
        headers: {
            Authorization : `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    });

    return response.data

}

export const verifyPayment = async (reference) => {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
        headers: {
            Authorization : `Bearer ${PAYSTACK_SECRET_KEY}`
        }
    });

    return response.data
}