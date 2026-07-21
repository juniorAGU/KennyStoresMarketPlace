
import { useState, useEffect, createContext } from 'react';
import { createPayouts,getPayouts } from '../Services/PayoutService';

export const payoutContext = createContext(); 
function Payoutprovider({children}) {
    const [payout, setPayout] = useState([]);
    const [payoutloading, setPayoutloading] = useState(false)

    const putPayouts = async (amount) => {
        setPayoutloading(true);
        try{
            
            const { alreadyWithdrawn, payouts} = await createPayouts(amount);
            setPayout(payouts)
        }catch(err){
            console.log(err)
        }finally{
            setPayoutloading(false)
        }

    }

    const Fetchpayouts = async () => {
        setPayoutloading(true);
        try {
            const { payouts } = await getPayouts();
            setPayout(payouts);
        } catch (err) {
            console.log(err);
        } finally {
            setPayoutloading(false);
        }
    }

    const values = {
        putPayouts,
        payoutloading,
        payout,
        Fetchpayouts

    }

    return <payoutContext.Provider value={values}>
        {children}
    </payoutContext.Provider> 
}

export default Payoutprovider