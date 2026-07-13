import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { getSpec,buyerDisput } from '../Services/OrderServces';
import {ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, User, Loader2} from 'lucide-react';
import UseMessage from '../Hooks/UseMessage';

function OrdersDetails() {

    const  { orderId }  = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)
    const [showDispute, setShowDispute] = useState(false);
    const { messages, Showmessage, typColo} = UseMessage();
    const [reason, setReason] = useState('');
    const [disputloading, setDisputloading] = useState(false)

    useEffect(() => {
        getSpec(orderId)
        .then(({order}) => (setOrder(order)))
        .catch(err => (setError(err.response?.data?.message || "unable to fetch your order")))
        .finally(() => setLoading(false))
    },[orderId]);

    const handleDispute = async () => {
        setDisputloading(true)
        try{
            await buyerDisput(orderId, reason);
            Showmessage("success", "Disput sent");
            setShowDispute(false);
            setReason("")
        }catch(err){
            console.log(err)
            Showmessage("failed", err?.response?.data?.message || "Unabel to send your disput try again!")
        }finally{
            setDisputloading(false);
        }

    }



    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle size={22} className='text-green-400' />;
            case 'shipped': return <Truck size={22} className='text-blue-400' />;
            case 'delivered': return <Package size={22} className='text-[#7C9A7E]' />;
            default: return <Clock size={22} className='text-yellow-400' />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'delivered': return 'bg-[#7C9A7E]/20 text-[#7C9A7E] border-[#7C9A7E]/30';
            default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    const timeline = ['pending', 'paid', 'shipped', 'delivered'];
    const currentStep = timeline.indexOf(order?.status);

    if (loading) return <Loader2 className='animate-spin' />;
    if (error) return <p className='text-red-400'>{error}</p>;
    if (!order) return <p className='text-white'>Order not found</p>;

    if (loading) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
            </section>
        );
    }

    if (error || !order) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 flex justify-center items-center'>
                <article className='text-center'>
                    <Package size={64} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                    <p className='text-[#E8EDE8]/50'>{error || 'Order not found'}</p>
                    <Link to='/orders' className='text-[#7C9A7E] hover:underline mt-2 inline-block'>Back to Orders</Link>
                </article>
            </section>
        );
    }
    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-5xl mx-auto'>

                {/* Header */}
                <article className='flex items-center justify-between mb-8'>
                    <article className='flex items-center gap-4'>
                        <Link to='/orders' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                            <ChevronLeft size={20} className='text-[#E8EDE8]' />
                        </Link>
                        <article>
                            <h1 className='text-white text-2xl font-bold'>Order Details</h1>
                            <p className='text-[#E8EDE8]/50 text-sm'>Order #{order.paymentReference || order._id.slice(-8)}</p>
                        </article>
                    </article>
                    <article className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </article>
                </article>

                <article className='grid lg:grid-cols-3 gap-8'>

                    {/* Left — Items & Seller */}
                    <article className='lg:col-span-2 space-y-6'>

                        {/* Order Timeline */}
                        <article className='bg-[#252C26] rounded-xl p-6'>
                            <h3 className='text-white font-semibold mb-4'>Order Progress</h3>
                            <article className='flex items-center justify-between relative'>
                                {timeline.map((step, index) => (
                                    <article key={step} className='flex flex-col items-center gap-2 flex-1'>
                                        <article className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                            index <= currentStep 
                                                ? 'bg-[#7C9A7E] text-white' 
                                                : 'bg-[#1A1E1B] text-[#E8EDE8]/30'
                                        }`}>
                                            {index < currentStep ? '✓' : index + 1}
                                        </article>
                                        <span className={`text-xs ${
                                            index <= currentStep ? 'text-[#E8EDE8]' : 'text-[#E8EDE8]/30'
                                        }`}>
                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                        </span>
                                        {index < timeline.length - 1 && (
                                            <article className={`absolute h-0.5 w-[calc(25%-2rem)] mt-5 ${
                                                index < currentStep ? 'bg-[#7C9A7E]' : 'bg-[#1A1E1B]'
                                            }`} style={{ left: `calc(${index * 25 + 12.5}% + 2rem)` }} />
                                        )}
                                    </article>
                                ))}
                            </article>
                        </article>

                        {/* Items */}
                        <article className='bg-[#252C26] rounded-xl p-6'>
                            <article className='flex items-center gap-3 mb-6'>
                                <img 
                                    src={order.seller?.image || order.items[0]?.image} 
                                    alt={order.seller?.name}
                                    className='w-12 h-12 rounded-full object-cover'
                                />
                                <article>
                                    <p className='text-white font-semibold'>{order.seller?.name || 'Seller'}</p>
                                    <p className='text-[#E8EDE8]/40 text-xs'>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                                        })}
                                    </p>
                                </article>
                            </article>

                            <article className='space-y-4'>
                                {order.items.map((item, index) => (
                                    <article key={index} className='flex items-center justify-between py-3 border-b border-[#1A1E1B] last:border-0'>
                                        <article className='flex items-center gap-4'>
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className='w-16 h-16 rounded-lg object-cover'
                                            />
                                            <article>
                                                <p className='text-white font-medium'>{item.name}</p>
                                                <p className='text-[#E8EDE8]/50 text-sm'>Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}</p>
                                            </article>
                                        </article>
                                        <p className='text-[#7C9A7E] font-semibold'>
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </article>
                                ))}
                            </article>

                            <article className='border-t border-[#1A1E1B] mt-4 pt-4 space-y-2'>
                                <article className='flex justify-between text-sm'>
                                    <span className='text-[#E8EDE8]/60'>Subtotal</span>
                                    <span className='text-white'>
                                        ₦{order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}
                                    </span>
                                </article>
                                <article className='flex justify-between text-sm'>
                                    <span className='text-[#E8EDE8]/60'>Shipping</span>
                                    <span className='text-white'>
                                        ₦{(order.items.reduce((sum, i) => sum + (i.shippingFee || 0), 0)).toLocaleString()}
                                    </span>
                                </article>
                                <article className='flex justify-between font-semibold text-base pt-2 border-t border-[#1A1E1B]'>
                                    <span className='text-white'>Total</span>
                                    <span className='text-[#7C9A7E]'>₦{Number(order.totalAmount).toLocaleString()}</span>
                                </article>
                            </article>
                        </article>
                    </article>

                    {/* Right — Info */}
                    <article className='space-y-6'>
                        
                        {/* Shipping */}
                        <article className='bg-[#252C26] rounded-xl p-6'>
                            <h3 className='text-white font-semibold mb-4'>Shipping Address</h3>
                            <article className='space-y-3'>
                                <article className='flex items-start gap-3'>
                                    <User size={18} className='text-[#E8EDE8]/40 mt-0.5' />
                                    <article>
                                        <p className='text-white text-sm'>{order.shippingAddress?.name}</p>
                                    </article>
                                </article>
                                <article className='flex items-start gap-3'>
                                    <MapPin size={18} className='text-[#E8EDE8]/40 mt-0.5' />
                                    <article>
                                        <p className='text-white text-sm'>{order.shippingAddress?.address}</p>
                                    </article>
                                </article>
                                <article className='flex items-start gap-3'>
                                    <Phone size={18} className='text-[#E8EDE8]/40 mt-0.5' />
                                    <article>
                                        <p className='text-white text-sm'>{order.shippingAddress?.phone}</p>
                                    </article>
                                </article>
                            </article>
                        </article>

                        {/* Payment Info */}
                        <article className='bg-[#252C26] rounded-xl p-6'>
                            <h3 className='text-white font-semibold mb-4'>Payment</h3>
                            <article className='space-y-3'>
                                <article className='flex justify-between'>
                                    <span className='text-[#E8EDE8]/60 text-sm'>Reference</span>
                                    <span className='text-white text-sm font-mono'>{order.paymentReference || 'N/A'}</span>
                                </article>
                                <article className='flex justify-between'>
                                    <span className='text-[#E8EDE8]/60 text-sm'>Status</span>
                                    <span className={`text-sm font-medium ${
                                        order.status === 'paid' ? 'text-green-400' 
                                        : order.status === 'shipped' ? "text-blue-400"
                                        : order.status === 'delivered' ? 'text-[#7C9A7E]'
                                        : 'text-yellow-400'
                                    }`}>
                                        {order.status === 'paid' ? 'Paid'
                                        : order.status === "shipped" ? "Shipped"
                                        : order.status === "delivered" ? "Deliverd"
                                        : 'Pending'}
                                    </span>
                                </article>
                            </article>

                            {order.status === 'pending' && order.paymentUrl && (
                                <button
                                    onClick={() => window.location.href = order.paymentUrl}
                                    className='w-full mt-4 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors'
                                >
                                    Complete Payment
                                </button>
                            )}
                        </article>

                        {order.status === 'shipped' && order.trackingNumber && (
                            <article className='bg-[#252C26] rounded-xl p-6'>
                                <h3 className='text-white font-semibold mb-4'>Tracking</h3>
                                <p className='text-[#E8EDE8]/60 text-sm mb-2'>Tracking Number</p>
                                <p className='text-white font-mono text-lg'>{order.trackingNumber}</p>
                                <button 
                                    onClick={() => window.open(`https://www.google.com/search?q=${order.trackingNumber}+tracking`, '_blank')}
                                    className='mt-3 text-[#7C9A7E] text-sm hover:underline'
                                >
                                    Track Package
                                </button>
                            </article>
                        )}

                        {order.status === 'shipped' && order.dispute?.status !== 'open' && (
                            <article className='bg-[#252C26] rounded-xl p-6'>
                                <button
                                    onClick={() => setShowDispute(true)}
                                    className='w-full py-2.5 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg hover:bg-red-500/10 transition-colors'
                                >
                                    Report Issue Of Not Received
                                </button>
                            </article>
                        )}

                        {/* Actions */}
                        <article className='bg-[#252C26] rounded-xl p-6'>
                            <button className='w-full py-2.5 border border-[#7C9A7E] text-[#7C9A7E] text-sm font-semibold rounded-lg hover:bg-[#7C9A7E] hover:text-white transition-colors'>
                                Contact Seller
                            </button>
                        </article>

                    </article>

                </article>
                {showDispute && (
                    <>
                        <article className='fixed inset-0 z-50 bg-black/50' onClick={() => setShowDispute(false)} />
                        <article className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#252C26] rounded-xl p-6 w-[90%] max-w-md'>
                            <h3 className='text-white font-semibold text-lg mb-2'>Report Issue</h3>
                            <p className='text-[#E8EDE8]/60 text-sm mb-4'>
                                Let the seller know you haven't received your order yet.
                            </p>
                            
                            <textarea
                                rows={3}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Describe your issue..."
                                className='w-full px-4 py-2.5 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white text-sm resize-none mb-4'
                            />

                            <article className='flex gap-3'>
                                <button
                                    onClick={() => setShowDispute(false)}
                                    className='flex-1 py-2.5 bg-[#1A1E1B] text-[#E8EDE8] text-sm rounded-lg'
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={disputloading}
                                    onClick={handleDispute}
                                    className='flex-1 flex justify-center items-center py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600'
                                >
                                    {disputloading ? <Loader2 className='animate-spin' size={16} /> : 'Submit Report'}
                                </button>
                            </article>
                        </article>
                    </>
                )}

            </article>
            {messages && (
                <article className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]}`}>
                    {messages.message}
                </article>
            )}
        </section>
    );
}

export default OrdersDetails