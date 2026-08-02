import axios from 'axios';
import crypto from 'crypto'

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

export const refundResponse = async (paymentref, amount, buyer) => {

    const response = await axios.post('https://api.paystack.co/refund',{
        transaction: paymentref,
        amount: amount * 100,
        machant_note: `Refund for Dispute order, buyer ${buyer}`
    },{
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    });
    console.log(response.data)
    return response.data

}

export const transferResponse = async (sellerId,amount,sellerCode) => {

    const response = await axios.post('https://api.paystack.co/transfer',{
        Source: 'balance',
        amount: amount * 100,
        recipient: sellerCode,
        reason: `payout for ${sellerId}`,
    },
    {
        headers : {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    });

    console.log(response.data);

    return response.data
}

export const recipiantFund = async (accoutName,accountNumber,bankCode) => {

    const response =  await axios.post('https://api.paystack.co/transferrecipient',
        {
            type: 'nuban',
            name: accoutName,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: 'NGN'
        },
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            },
            timeout: 30000
        },
        
    );

    console.log("paystack response",response.data);
    return response.data
}

export const bankNames = async () => {

    const response =  await axios.get('https://api.paystack.co/bank',
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        }
    );

    return response.data
}

export const webHookVerification = (payload,signature) => {

    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
                .update(JSON.stringify(payload))
                .digest('hex');

    return hash === signature
}