import API from "./axiosConfig";


export const getCart = async () => {

    const { data } = await API.get('/api/cart');

    return data;
};

export const createCart = async (productId,quantity) => {

    const { data } = await API.post("/api/cart",{ productId, quantity })

    return data
}

export const updateCartItem = async (itemId, quantity) => {

    const { data } = await API.patch(`/api/cart/${itemId}`, { quantity });

    return data;
};

export const removeFromCart = async (itemId) => {

    const { data } = await API.delete(`/api/cart/${itemId}`);

    return data;
};

export const clearCart = async () => {

    const { data } = await API.delete('/api/cart');
    
    return data;
};
