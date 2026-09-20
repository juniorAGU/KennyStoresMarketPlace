import API from "../Services/axiosConfig";
import UseAuth from "./UseAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const orderKey = {
    all: ['order']
}

export const useOrder = () => {

    const queryClient = useQueryClient();

    return useQuery({
        queryKey: orderKey,
        queryFn: async () => {

            const { data } = await API.get('/api/orders')

            return data

        },
        staleTime: 100 * 60 * 5
    })
}