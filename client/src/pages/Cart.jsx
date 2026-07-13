// pages/Cart.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import UseCart from '../Hooks/UseCart';
import UseMessage from '../Hooks/UseMessage';

const Cart = () => {
    const { AddToCart, FetchCart, UpdateCart, RemoveItem, cleraAllCart, cart, loading, error,setCart,} = UseCart();
    const {messages,Showmessage,typColo } = UseMessage();
    

    useEffect(() => {
        FetchCart();
    }, []);

    const handleQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;

        // setCart(prev => ({
        //     ...prev,
        //     items: prev.items.map(item => item._id === itemId ? { ...item, quantity: newQty} : item),
        //     totalprice: prev.items.reduce((sum, pro) => sum + (pro.price * (pro._id === itemId ? newQty : pro.quantity)),0),
        //     totalquantity: prev.items.reduce((sum,pro) => sum + (pro._id === itemId ? newQty : pro.quantity),0)
        // }))
        try{

            await UpdateCart(itemId, newQty);

        }catch(err){
            console.log(" handleQUANTITY Error!!!",err?.response?.data?.message);
            Showmessage("failed", err?.response?.data?.message || "unable to update quantity")
            FetchCart();
        }
        
        
    };

    console.log("cart Items", cart);

    const handleRemove = async (itemId) => {
        await RemoveItem(itemId);
        FetchCart();
    };

    if (loading) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
            </section>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4'>
                <article className='max-w-2xl mx-auto text-center py-20'>
                    <ShoppingBag size={64} className='text-[#E8EDE8]/20 mx-auto mb-6' />
                    <h2 className='text-white text-2xl font-bold mb-2'>Your cart is empty</h2>
                    <p className='text-[#E8EDE8]/50 mb-8'>Looks like you haven't added anything yet.</p>
                    <Link 
                        to='/marketplace'
                        className='inline-block px-8 py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors'
                    >
                        Browse Products
                    </Link>
                </article>
            </section>
        );
    }

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-6xl mx-auto'>

                <article className='flex items-center justify-between mb-10'>
                    <article className='flex items-center gap-4'>
                        <Link 
                            to='/marketplace'
                            className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'
                        >
                            <ChevronLeft size={20} className='text-[#E8EDE8]' />
                        </Link>
                        <article>
                            <h1 className='text-white text-2xl font-bold'>Shopping Cart</h1>
                            <p className='text-[#E8EDE8]/50 text-sm'>{cart.totalquantity || cart.items.length} items</p>
                        </article>
                    </article>
                    <button 
                        onClick={cleraAllCart}
                        className='text-[#E8EDE8]/50 text-sm hover:text-red-400 transition-colors'
                    >
                        Clear All
                    </button>
                </article>

                <article className='grid lg:grid-cols-[1fr_380px] gap-8'>
                    
                    {/* Cart Items — wider, no center constraint */}
                    <article className='space-y-4'>
                        {cart.items.map((item) => (
                            <article 
                                key={item._id}
                                className='bg-[#252C26] rounded-xl p-5 flex gap-5'
                            >
                                
                                <Link to={`/marketplace/${item.product?._id}`} className='flex-shrink-0'>
                                    <img 
                                        src={item.product?.images?.[0]} 
                                        alt={item.product?.name}
                                        className='w-32 h-32 md:w-36 md:h-36 rounded-lg object-cover'
                                    />
                                </Link>

                                {/* Product Details */}
                                <article className='flex-1 flex flex-col justify-between min-w-0'>
                                    <article>
                                        <Link to={`/marketplace/${item.product?._id}`}>
                                            <h3 className='text-white font-semibold text-base hover:text-[#7C9A7E] transition-colors'>
                                                {item.product?.name}
                                            </h3>
                                        </Link>
                                        <p className='text-[#7C9A7E] font-bold text-xl mt-2'>
                                            ₦{Number(item.price).toLocaleString()}
                                        </p>
                                    </article>

                                    <article className='flex items-center justify-between mt-4'>
                                        {/* Quantity Controls */}
                                        <article className='flex items-center gap-3'>
                                            <button 
                                                onClick={() => handleQuantity(item._id, item.quantity - 1)}
                                                className='w-9 h-9 bg-[#1A1E1B] text-[#E8EDE8] rounded-lg flex items-center justify-center hover:bg-[#7C9A7E] transition-colors'
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className='text-white font-semibold w-8 text-center'>{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantity(item._id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product?.quantity}
                                                className='w-9 h-9 bg-[#1A1E1B] text-[#E8EDE8] rounded-lg flex items-center justify-center hover:bg-[#7C9A7E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </article>

                                        {/* Subtotal */}
                                        <p className='text-[#E8EDE8] text-sm'>
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </article>
                                </article>

                                {/* Remove Button */}
                                <button 
                                    onClick={() => handleRemove(item._id)}
                                    className='p-2 text-[#E8EDE8]/40 hover:text-red-400 transition-colors self-start'
                                >
                                    <Trash2 size={20} />
                                </button>
                            </article>
                        ))}
                    </article>

                    {/* Order Summary — sticky sidebar */}
                    <article>
                        <article className='bg-[#252C26] rounded-xl p-6 sticky top-24'>
                            <h2 className='text-white font-semibold text-lg mb-6'>Order Summary</h2>
                            
                            <article className='space-y-4 text-sm mb-6'>
                                <article className='flex justify-between'>
                                    <span className='text-[#E8EDE8]/60'>Subtotal ({cart.totalquantity || cart.items.length} items)</span>
                                    <span className='text-white font-medium'>₦{Number(cart.totalprice).toLocaleString()}</span>
                                </article>
                                <article className='flex justify-between'>
                                    <span className='text-[#E8EDE8]/60'>Shipping</span>
                                    <span className='text-[#7C9A7E] text-xs'>Calculated at checkout</span>
                                </article>
                            </article>

                            <article className='border-t border-[#1A1E1B] pt-5 mb-6'>
                                <article className='flex justify-between'>
                                    <span className='text-white font-semibold text-base'>Total</span>
                                    <span className='text-[#7C9A7E] font-bold text-2xl'>
                                        ₦{Number(cart.totalprice).toLocaleString()}
                                    </span>
                                </article>
                            </article>

                            <Link 
                                to='/checkout'
                                className='block w-full py-3.5 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors text-center'
                            >
                                Proceed to Checkout
                            </Link>

                            <Link 
                                to='/marketplace'
                                className='block w-full py-3 text-[#7C9A7E] text-sm text-center hover:underline mt-3'
                            >
                                Continue Shopping
                            </Link>
                        </article>
                    </article>

                </article>

            </article>
            {
                messages && (
                    <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typColo[messages.type]} `}>
                        <h1>
                            {messages.message}
                        </h1>
                    </div>
                )
            }
        </section>
    );
};

export default Cart;