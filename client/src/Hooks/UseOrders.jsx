import API from "../Services/axiosConfig";
import UseAuth from "./UseAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const orderKey = {
    all: ['order'],
    specific: (id) => ['order', id],
}

export const useOrder = () => {

    

    return useQuery({
        queryKey: orderKey,
        queryFn: async () => {

            const { data } = await API.get('/api/orders')
            console.log('response 1', data)

            return data.orders

        },
        staleTime: 100 * 60 * 5
    })
};

export const useSpecificOrder = (orderId) => {
    
    return useQuery({
        queryKey: orderKey.specific,
        queryFn: async () => {
            
            const { data } = await API.get(`/api/orders/${orderId}`)

            return data.order
        },
        enabled: !!orderId
    })

}