import {useQueryClient, useMutation,useQuery} from '@tanstack/react-query';
import API from "../Services/axiosConfig";
import {orderKey} from './UseOrders';


export const useVerifyPayment = (reference) => {
    console.log('reference', reference)

    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['verifypayment', reference],
        queryFn: async () => {
            const { data } = API.get(`/api/verify/${reference}`);
            console.log(data)

            return data
        }, 
        enabled: !!reference,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:orderKey.all})
        }

    })
}