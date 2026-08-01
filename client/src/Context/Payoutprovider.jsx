
import { useState, useEffect, createContext } from 'react';
import { createPayouts,getPayouts } from '../Services/PayoutService';

export const payoutContext = createContext(); 
function Payoutprovider({children}) {
    const [payout, setPayout] = useState([]);
    const [payoutloading, setPayoutloading] = useState(false)
    const [withdrawn, setWithdrawn] = useState(0);
    const [earning, setEarning] = useState(0);
    const [balance, setBalance] = useState(0);
    const [pendingMoney, setPendingMoney] = useState(0)

    const putPayouts = async (amount) => {
        setPayoutloading(true);
        try{
            
            const response = await createPayouts(amount);
            setPayout(prev => [response.payouts, ...prev])
            setBalance(response.avaliableBalance);
            setEarning(response.earning);
            setPendingMoney(response.pendingMoney);
            setWithdrawn(response.alreadyWithdrawn)
        }catch(err){
            console.log(err)
        }finally{
            setPayoutloading(false)
        }

    }

    const Fetchpayouts = async () => {
        setPayoutloading(true);
        try {
            const response = await getPayouts();
            setPayout(response?.payouts);
            setBalance(response.avaliableBalance);
            setEarning(response.earning);
            setPendingMoney(response.pendingMoney);
            setWithdrawn(response.alreadyWithdrawn)
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
        Fetchpayouts,
        withdrawn,
        pendingMoney,
        earning,
        balance,

    }

    return <payoutContext.Provider value={values}>
        {children}
    </payoutContext.Provider> 
}

export default Payoutprovider