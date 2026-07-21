
import { useContext } from 'react';
import { payoutContext } from '../Context/Payoutprovider';

function Usepayout() {
    const context = useContext(payoutContext);
    if(!context){
        throw new Error("context must be between provider")
    }
    return context
}

export default Usepayout