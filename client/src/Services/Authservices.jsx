import axios from "axios";

const API = axios.create({baseURL: "http://localhost:5000"});

API.defaults.withCredentials = true;

let cashedUser = null;

export const registerUser = async (userDater) => {

    const { data } = await API.post("/api/register", userDater);

    cashedUser = null;

    return data;
};

export const loginUser = async (userdata) => {

    const { data } = await API.post("/api/login", userdata);

    cashedUser = null;

    return data;
};

export const getCurrentUser = async () => {

    const { data } = await API.get("/api/user/me");

    cashedUser = data.user;

    return data;
};

export const logoutServices = async () => {

    const { data } = await API.post("/api/logout");

    return data
};

export const updateUser = async (formData) => {

    const { data } = await API.patch("/users/profile", formData);

    cashedUser = null;

    return data;

}

export const switchAccount = async () => {

    const { data } = await API.patch("/api/switch-account");

    return data
}

export const changePassword = async (newData, oldData) => {

    const { data } = await API.patch("/api/change-password", { newData, oldData});

    return data
}

export const changeForgotten = async (email) => {

    const { data } = await API.post("/api/forgot-password", { email});

    return data
}

export const verify  = async (token,otp) => {

    const { data } = await API.post("/api/verify-otp", { token, otp});

    return data
} 

export const resetPas  = async (token,password) => {

    const { data } = await API.patch("/api/reset-password", { token, password});

    return data
} 







export const clearCashedUser = () => {

    cashedUser = null

}