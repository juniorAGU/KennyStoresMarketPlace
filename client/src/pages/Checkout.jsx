// pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, MapPin, Phone, User, Package } from 'lucide-react';
import UseCart from '../Hooks/UseCart';
import UseAuth from '../Hooks/UseAuth';
import UseMessage from '../Hooks/UseMessage';
import { createCheckout } from '../Services/OrderServces';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, FetchCart } = UseCart();

    

    const { user } = UseAuth();
    const { Showmessage, typColo, messages } = UseMessage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        address: '',
        phone: ''
    });

    useEffect(() => {
        FetchCart();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    console.log("cart Items", cart)

    const groupBySeller = () => {
        const grouped = {};
        cart?.items?.forEach(item => {
            const sellerId = item.product?.seller?._id || item.product?.seller || 'unknown';
            const sellerName = item.product?.seller?.name || 'Unknown Seller';
            if (!grouped[sellerId]) {
                grouped[sellerId] = { sellerName, items: [], total: 0, shippingFee: 0 };
            }
            grouped[sellerId].items.push(item);
            grouped[sellerId].total += item.price * item.quantity;
            grouped[sellerId].shippingFee += (item.product?.shippingFee || 0);

            console.log("Group after:", grouped[sellerId]);
        });
        console.log("Final grouped:", grouped);
        return grouped;
    };

    const groupedOrders = groupBySeller();
    const grandTotal = Object.values(groupedOrders).reduce((sum, g) => sum + (g.total + g.shippingFee), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.phone) {
            Showmessage('failed', 'Please fill in all shipping details');
            return;
        }

        setLoading(true);
        try {
            const { orders, authorization_url } = await createCheckout( {shippingAddress: formData} );
            Showmessage('success', 'Orders placed successfully!');
            window.location.href = authorization_url
            // navigate('/orders');
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 flex justify-center items-center'>
                <article className='text-center'>
                    <Package size={64} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                    <p className='text-[#E8EDE8]/50 mb-4'>Your cart is empty</p>
                    <Link to='/marketplace' className='text-[#7C9A7E] hover:underline'>Browse Products</Link>
                </article>
            </section>
        );
    }

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-4xl mx-auto'>

                {/* Header */}
                <article className='flex items-center gap-4 mb-8'>
                    <Link to='/cart' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                        <ChevronLeft size={20} className='text-[#E8EDE8]' />
                    </Link>
                    <div>
                        <h1 className='text-white text-2xl font-bold'>Checkout</h1>
                        <p className='text-[#E8EDE8]/50 text-sm'>Review your orders and place them</p>
                    </div>
                </article>

                <form onSubmit={handleSubmit}>
                    <article className='grid lg:grid-cols-3 gap-8'>

                        {/* Left — Orders & Shipping */}
                        <article className='lg:col-span-2 space-y-6'>

                            {/* Orders Grouped by Seller */}
                            {Object.entries(groupedOrders).map(([sellerId, group]) => (
                                <article key={sellerId} className='bg-[#252C26] rounded-xl p-5'>
                                    <article className='flex items-center gap-2 mb-4'>
                                        <Package size={18} className='text-[#7C9A7E]' />
                                        <h3 className='text-white font-semibold'>{group.sellerName}</h3>
                                    </article>

                                    <article className='space-y-3'>
                                        {group.items.map((item) => (
                                            <article key={item._id} className='flex items-center justify-between'>
                                                <article className='flex items-center gap-3'>
                                                    <img 
                                                        src={item.product?.images?.[0]} 
                                                        alt={item.product?.name}
                                                        className='w-12 h-12 rounded-lg object-cover'
                                                    />
                                                    <article>
                                                        <p className='text-white text-sm'>{item.product?.name}</p>
                                                        <p className='text-[#E8EDE8]/50 text-xs'>Qty: {item.quantity}</p>
                                                    </article>
                                                </article>
                                                <p className='text-[#7C9A7E] text-sm font-semibold'>
                                                    ₦{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                                
                                            </article>
                                        ))}
                                    </article>

                                    <article className='border-t border-[#1A1E1B] mt-4 pt-3 flex justify-between'>
                                        <span className='text-[#E8EDE8]/60 text-sm'>Seller Total</span>
                                        <span className='text-white font-semibold'>₦{group.total.toLocaleString()}</span>
                                    </article>
                                </article>
                            ))}

                            {/* Shipping Address */}
                            <article className='bg-[#252C26] rounded-xl p-5'>
                                <h3 className='text-white font-semibold mb-4'>Shipping Address</h3>
                                
                                <article className='space-y-4'>
                                    <article>
                                        <label className='block text-[#E8EDE8]/60 text-sm mb-2'>Full Name</label>
                                        <article className='flex items-center gap-3 bg-[#1A1E1B] rounded-lg px-4 py-3'>
                                            <User size={18} className='text-[#E8EDE8]/40' />
                                            <input
                                                type='text'
                                                name='name'
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder='Enter your full name'
                                                className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                                            />
                                        </article>
                                    </article>

                                    <article>
                                        <label className='block text-[#E8EDE8]/60 text-sm mb-2'>Address</label>
                                        <article className='flex items-center gap-3 bg-[#1A1E1B] rounded-lg px-4 py-3'>
                                            <MapPin size={18} className='text-[#E8EDE8]/40' />
                                            <input
                                                type='text'
                                                name='address'
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder='Enter your delivery address'
                                                className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                                            />
                                        </article>
                                    </article>

                                    <article>
                                        <label className='block text-[#E8EDE8]/60 text-sm mb-2'>Phone Number</label>
                                        <article className='flex items-center gap-3 bg-[#1A1E1B] rounded-lg px-4 py-3'>
                                            <Phone size={18} className='text-[#E8EDE8]/40' />
                                            <input
                                                type='tel'
                                                name='phone'
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder='Enter your phone number'
                                                className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                                            />
                                        </article>
                                    </article>
                                </article>
                            </article>
                        </article>

                        {/* Right — Summary */}
                        <article className='lg:col-span-1'>
                            <article className='bg-[#252C26] rounded-xl p-5 sticky top-24'>
                                <h3 className='text-white font-semibold mb-4'>Order Summary</h3>

                                <article className='space-y-2 text-sm mb-4'>
                                    {Object.entries(groupedOrders).map(([sellerId, group]) => (
                                        <>
                                        <article key={sellerId} className='flex justify-between'>
                                            <span className='text-[#E8EDE8]/60'>{group.sellerName}</span>
                                            <span className='text-white'>₦{group.total.toLocaleString()}</span>
                                        </article>
                                        <article className='flex justify-between'>
                                            <span className='text-[#E8EDE8]/60'>shippingFee</span>
                                            <span className='text-white'>₦{(group?.shippingFee || 0).toLocaleString()}</span>
                                        </article>
                                        </>
                                    ))}
                                </article>

                                <article className='border-t border-[#1A1E1B] pt-4'>
                                    <article className='flex justify-between mb-4'>
                                        <span className='text-white font-semibold'>Grand Total</span>
                                        <span className='text-[#7C9A7E] font-bold text-xl'>₦{grandTotal.toLocaleString()}</span>
                                    </article>

                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='w-full py-3.5 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className='animate-spin' />
                                                Placing Orders...
                                            </>
                                        ) : (
                                            'Place Orders'
                                        )}
                                    </button>
                                </article>
                            </article>
                        </article>

                    </article>
                </form>

            </article>

            {messages && (
                <article className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]}`}>
                    {messages.message}
                </article>
            )}
        </section>
    );
};

export default Checkout;