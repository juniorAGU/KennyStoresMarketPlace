import API from "./axiosConfig";

export const Allbanks = async () => {

    const { data } = await API.get("/api/all/banks");

    return data
}

export const createPayouts = async (amount) => {

    const { data } = await API.post('/api/earnings/withdrawal', {amount});

    return data

}
export const getPayouts = async () => {
    
    const { data } = await API.get('/api/earnings/withdrawal');

    return data
    
} 