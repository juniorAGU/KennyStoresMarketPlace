import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL });

API.defaults.withCredentials = true;

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