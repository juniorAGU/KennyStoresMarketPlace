import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL });

API.defaults.withCredentials = true;

export const SendComment = async (productId,text) => {

    const { data } = await API.post(`/api/comments`, {productId, text});

    return data;
};

export const getComments = async (productid) => {

    const { data } = await API.get(`/api/comments/${productid}`);

    return data;
}
export const DeleteComment = async(productId) => {

    const { data } = await API.delete(`/api/comments/${productId}`);

    return data;
}

export const createLikes1 = async (productId) => {
    
    const { data } = await API.post(`/api/likes/${productId}`);

    return data;
}

export const getLikes1 = async (productId) => {

    const { data } = await API.get(`/api/likes/${productId}`);

    return data;
}