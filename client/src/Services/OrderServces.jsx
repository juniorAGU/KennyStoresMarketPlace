import axios from "axios";

const API = axios.create({baseURL: "http://localhost:5000"});

API.defaults.withCredentials = true

export const createCheckout = async (userdata) => {

    const { data } = await API.post("/api/checkout",  userdata);

    return data
}

export const verifyPaystackPayment = async (reference) => {

    const { data } = await API.get(`/api/verify/${reference}`)

    return data
}

export const getAllOrders = async () => {

    const { data } = await API.get("/api/orders");

    return data 
}

export const getSpec = async (orderId) => {
    console.log(orderId)

    const { data } = await API.get(`/api/orders/${orderId}`)

    return data
}

export const getSellersinfo = async (sellerId) => {

    const { data } = await API.get(`/api/seller/${sellerId}`);

    return data
}

export const buyerDisput = async (orderId, reason) => {

    const { data } = await API.post(`/api/orders/${orderId}`, { reason });

    return data 
}

export const getsellersOrder = async () => {

    const { data } = await API.get("/api/sellerorders");

    return data
}

export const updateSellerOrders = async (orderId, status, trackingNumber) => {

    const { data } = await API.patch(`/api/selleroders/${orderId}`, {status,trackingNumber})

    return data
}

export const resolveDispute = async (orderId, resolution) => {

    const { data } = await API.post(`/api/selleroders/${orderId}`, { resolution })

    return data
}

export const dashBoard = async() => {
    
    const { data } = await API.get('/api/seller/dashboard')

    return data
}