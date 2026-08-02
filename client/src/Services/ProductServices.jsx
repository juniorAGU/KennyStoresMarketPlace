import API from "./axiosConfig";

export const getProducts = async (category= '') => {

    const url = category ? `/api/products?category=${category}` : '/api/products';

    const { data } = await API.get(url);

    return data;

}

export const getSpecifiedProduct = async (id) => {

    const { data } = await API.get(`/api/products/${id}`);

    return data;
}

export const getEditeSpecificProduct = async (id) => {

    const { data } = await API.get(`/api/products/${id}`);

    return data;
}

export const getmyProducts = async (pageNum = 1, limit = 10) => {

    const { data } = await API.get(`/api/products/my?page=${pageNum}&limit=${limit}`);

    return data;
}

export const CreateProducts = async (userdata) => {

    const { data } = await API.post("/api/products", userdata);

    return data;

}

export const UpdateProducts = async (userdata,id) => {
    console.log("Updating product with ID:", id);

    const { data } = await API.patch(`/api/products/${id}`, userdata);


    return data;
}

export const DeleteProduct = async (id) => {

    const { data } = await API.delete(`/api/products/${id}`);

    return data;

}