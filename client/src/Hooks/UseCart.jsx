import { useContext } from "react";
import { CartContext } from "../Context/Cartprovider";
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import API from "../Services/axiosConfig";
import UseAuth from "./UseAuth";



export const cartKey = {
    all: ['cart']
}
export function useCart() {

    const { user} = UseAuth();
    


    return useQuery({
        queryKey: cartKey.all,
        queryFn: async () => {
            const data = await API.get('/api/cart') 
            return data.cart
        },
        enabled: !!user && user.accountType === 'buyer', 
        staleTime: 100 * 60 * 5
    })

}

export function useAddToCart() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({productId, quantity}) => {

            const { data } = await API.post('/api/cart',{ productId, quantity})

            return data

        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: cartKey.all})
        },
    })
}

export const useUpdateCartQuantity = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async({itemId, quantity}) => {

            const { data } = await API.patch(`/api/cart/${itemId}`, { quantity })

            return data
        },
        onSuccess: () => {
            queryClient.infiniteQuery({queryKey: cartKey.all})
        }
    })
}

export const useRemoveCartItem = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({productId}) => {

            const { data } = await API.delete(`/api/cart/${productId}`)

            return data
        },
        onSuccess: () => {
            queryClient.infiniteQuery({queryKey: cartKey.all})
        }
    })
};

export const usedeleteCart = () => {

    const queryClient =  useQueryClient();

    return useMutation({

        mutationFn: async () => {

            const { data} = await API.delete('/api/cart');

            return data
        },

        onSuccess: () => {
            queryClient.infiniteQuery({queryKey: cartKey.all})
        }
    })
} 
