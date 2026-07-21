import React from 'react'
import { useState,useEffect,createContext } from 'react';
import { registerUser,loginUser,getCurrentUser,logoutServices,clearCashedUser,updateUser } from '../Services/Authservices';



export const authContext = createContext();

function AuthContectProvider({children}) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);



    const fetchUser = async () => {

            try{

                const { user } = await getCurrentUser();

                setUser(user)

            }catch(err){
                console.log(err);
                setError(err.response.data.message || "Faild fetch user");
                throw err
            }finally{
                setLoading(false)
            }

    }

    useEffect(() => {

        fetchUser();

    },[])


    const register = async (userdata) =>{

        setError(null);

        try{

            const { user } = await registerUser(userdata);

            console.log(user)

            
            setUser(user);

            return true

        }catch(err){
            console.log(err);
            setError(err.response.data.message || "Registration Faild");
            throw err
        }

    }
    const login = async(credential) => {

        setError(null);

        try{

            const { user } = await loginUser(credential);

            setUser(user);

            return true

        }catch(err){
            console.log(err);
            setError(err.response.data.message || "Login Faild");
            throw err
        }

    }

    const logout = async () => {
        
        try{

            await logoutServices();

            clearCashedUser();

            setUser(null)

            console.log('User set to null'); 

        }catch(err){
            console.log(err);
            setError(err.response.data.message);
            throw err
        }
    }

    const EditUser = async ({name,email,bio,title,location,phone,image, accountName,accountNumber,bankcode}) => {

        setError(null);

        try{

            const formdata = new FormData();
                formdata.append("name",name);
                formdata.append("email", email);
                formdata.append("title",title);
                formdata.append("bio",bio);
                formdata.append("location", location);
                formdata.append("phone", phone);
                formdata.append("image", image);
                formdata.append("accountName", accountName);
                formdata.append("accountNumber", accountNumber);
                formdata.append("bankcode", bankcode);

            const { user } = await updateUser(formdata);

            setUser(user)

            return true;

        }catch(err){
            console.log(err)
            setError(err.response.data.message || "Failed to update user");
            throw err
        }
    }



    const values = {
        register,
        login,
        user,
        EditUser,
        loading,
        logout,
        error,
        isAuthenticated: !!user,
        fetchUser

    }
    return (
        <authContext.Provider value={values}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContectProvider