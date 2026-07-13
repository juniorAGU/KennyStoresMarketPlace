import { useState, useEffect, createContext } from "react";
import { createCart,getCart, updateCartItem, clearCart,removeFromCart } from "../Services/CartService";
import { getAllOrders } from "../Services/OrderServces";


export const CartContext = createContext();
function Cartprovider({children}) {
    const [cart, setCart] =   useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const FetchCart =  async () => {
        setError(null);
        setLoading(true)
        try{

            const { cart } = await getCart();

            setCart(cart);
            
        }catch(err){
            console.log(err);
            setError(err?.response?.data?.message || "unable to fetch  cart");

        }finally{
            setLoading(false);
        }
    }


    const AddToCart = async (productId, quantity) => {
        setError(null);
        try{

            const { cart } = await createCart(productId,quantity);

            setCart(cart);

        }catch(err){
            console.log(err);
            setError(err?.response?.data?.message || "unable to Add to cart")
            throw err
        }

    }

    const UpdateCart = async (productId, quantity) => {
        setError(null);
        try{

            const { cart } =  await updateCartItem(productId,quantity);

            setCart(cart)

            return true

        }catch(err){
            console.log(err)
            setError(err?.response?.data?.message || "unable to Update Cart")
            throw err
        }
    }

    const RemoveItem = async (productId) => {
        setError(null);
        try{

            const { cart } = await removeFromCart(productId);

            setCart(cart);

            return true

        }catch(err){
            console.log(err);
            setError(err?.response?.data?.message || "unable to remove item");
            throw err
        }
    };

    const cleraAllCart =  async () => {

        await clearCart();

    }

    const getOrder = async () => {
        setError(null);
        setLoading(true)
        try{

            const { orders } = await getAllOrders();

            setOrder(orders);

        }catch(err){
            console.log(err);
            setError(err?.response?.data?.message || "unable to fetch orders");
        }finally{
            setLoading(false);
        }
    }


    const values = {
        AddToCart,
        FetchCart,
        UpdateCart,
        RemoveItem,
        cleraAllCart,
        setCart,
        cart,
        loading,
        error,
        getOrder,
        orders: order
    }
    return (
        <CartContext.Provider value={values}>
            {children}
        </CartContext.Provider>
    )
}

export default Cartprovider