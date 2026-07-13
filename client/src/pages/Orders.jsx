// pages/Orders.jsx
import { Link } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, ShoppingBag,Loader2 } from 'lucide-react';
import { useState,useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyPaystackPayment } from '../Services/OrderServces';
import UseCart from '../Hooks/UseCart';
import UseMessage from '../Hooks/UseMessage';

const Orders = () => {

    const [searchParams] = useSearchParams();

    const reference = searchParams.get("reference");

    const { getOrder , orders, loading} = UseCart();
    const {messages, Showmessage, typColo} = UseMessage();
    console.log("all Orders", orders)

    useEffect(() => {
    if (reference) {
        verifyPaystackPayment(reference)
            .then(() => getOrder())  
            .catch(err => Showmessage("failed", err?.response?.data?.message || "payment Error try again"));
    }

    getOrder();

}, [reference]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle size={18} className='text-green-400' />;
            case 'shipped': return <Truck size={18} className='text-blue-400' />;
            case 'delivered': return <Package size={18} className='text-[#7C9A7E]' />;
            default: return <Clock size={18} className='text-yellow-400' />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'paid': return 'Paid';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            default: return 'Pending';
        }
    };

    if (!orders || orders.length === 0) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 flex justify-center items-center'>
                <article className='text-center'>
                    <ShoppingBag size={64} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                    <h2 className='text-white text-2xl font-bold mb-2'>No orders yet</h2>
                    <p className='text-[#E8EDE8]/50 mb-4'>Start shopping to see your orders here</p>
                    <Link to='/marketplace' className='text-[#7C9A7E] hover:underline'>Browse Products</Link>
                </article>
            </section>
        );
    }

    if (loading) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
            </section>
        );
    }

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-4xl mx-auto'>

                {/* Header */}
                <article className='flex items-center gap-4 mb-8'>
                    <Link to='/marketplace' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                        <ChevronLeft size={20} className='text-[#E8EDE8]' />
                    </Link>
                    <div>
                        <h1 className='text-white text-2xl font-bold'>My Orders</h1>
                        <p className='text-[#E8EDE8]/50 text-sm'>Track your purchases</p>
                    </div>
                </article>

                {/* Orders List */}
                <article className='space-y-6'>
                    {orders.map((order) => (
                        
                        <article key={order._id} className='bg-[#252C26] rounded-xl overflow-hidden'>
                            

                            <Link to={`/orders/${order._id}`} className='block'>
                                <article className='flex items-center justify-between p-5 border-b border-[#1A1E1B]'>
                                    <article className='flex items-center gap-3'>
                                        <img 
                                            src={order.items[0]?.image} 
                                            alt={order.items[0]?.name}
                                            className='w-10 h-10 rounded-lg object-cover'
                                        />
                                        <article>
                                            <p className='text-white font-semibold text-sm'>{order.seller.name}</p>
                                            <p className='text-[#E8EDE8]/40 text-xs'>
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'short', day: 'numeric', year: 'numeric' 
                                                })}
                                            </p>
                                        </article>
                                    </article>
                                    <article className='flex items-center gap-2'>
                                        {getStatusIcon(order.status)}
                                        <span className='text-sm text-[#E8EDE8]'>{getStatusText(order.status)}</span>
                                    </article>
                                    {order.status === 'pending' && !order.paymentReference && (
                                        
                                        <button
                                            onClick={() => window.location.href = order?.paymentUrl}
                                            className='mt-3 px-4 py-2 bg-[#7C9A7E] text-white text-sm rounded-lg'
                                        >
                                            complete payment

                                        </button>
                                    )}
                                </article>

                                {/* Order Items */}
                                <article className='p-5 space-y-3'>
                                    {order.items.map((item, index) => (
                                        
                                        <article key={index} className='flex items-center justify-between'>
                                            <article className='flex items-center gap-3'>
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className='w-12 h-12 rounded-lg object-cover'
                                                />
                                                <article>
                                                    <p className='text-white text-sm'>{item.name}</p>
                                                    <p className='text-[#E8EDE8]/50 text-xs'>Qty: {item.quantity}</p>
                                                </article>
                                            </article>
                                            <p className='text-[#7C9A7E] text-sm font-semibold'>
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </article>
                                        
                                    ))}
                                </article>

                                {/* Order Footer */}
                                <article className='border-t border-[#1A1E1B] p-5 flex items-center justify-between'>
                                    <article>
                                        <p className='text-[#E8EDE8]/50 text-xs'>Shipping to</p>
                                        <p className='text-white text-sm'>{order.shippingAddress.name}</p>
                                        <p className='text-[#E8EDE8]/40 text-xs'>{order.shippingAddress.address}</p>
                                    </article>
                                    <article className='text-right'>
                                        <p className='text-[#E8EDE8]/50 text-xs'>Total</p>
                                        <p className='text-[#7C9A7E] font-bold text-lg'>₦{order.totalAmount.toLocaleString()}</p>
                                    </article>
                                </article>
                            </Link>

                        </article>

                    ))}
                </article>

            </article>
            {
                messages && (
                    <div className={`slider fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]} `}>
                        <h1>

                            {messages.message}

                        </h1>
                    </div>
                )
            }
        </section>
    );
};

export default Orders;