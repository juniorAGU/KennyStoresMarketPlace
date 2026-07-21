import React from 'react'
import { useState, useEffect } from 'react';
import { getsellersOrder, updateSellerOrders, resolveDispute } from '../Services/OrderServces';
import UseMessage from '../Hooks/UseMessage';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, Search, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import UseAuth from '../Hooks/UseAuth';

function SellerOrder() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState (null);
    const {messages, Showmessage, typColo} = UseMessage();
    const [filter, setFilter] = useState("all");
    const [selectedorder, setSelectedorder] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [resolveloading, setResolveloading] = useState(false)
    const { user} = UseAuth();

    useEffect(() => {
        if(user?.accountType === 'seller'){
            getsellersOrder()
            .then(({orders}) => {
                setOrders(orders)
            })
            .catch(err => {
                setErr(err?.response?.data?.message ||  "unable to fetch orders")
            })
            .finally(() => setLoading(false))
        }
    },[user]);

    const filterOrders = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => {
        if (filter === 'disputed') return o.dispute?.status === 'open';
        return filter === 'all' || o.status === filter;
    })
    .filter(o => {
        if(!searchTerm) return true

        const ref = o?.paymentReference?.toLowerCase() || '';
        const buyer = o?.buyer?.name?.toLowerCase() || ''; 
        const items = o?.items?.some(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()));

        return ref.includes(searchTerm.toLowerCase()) 
        || buyer.includes(searchTerm.toLowerCase()) 
        || items;
    })

    const statusCounts = {
        all: orders.length,
        paid: orders.filter(o => o.status === 'paid').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        disputed: orders.filter(o => o.dispute?.status === 'open').length,
    };

    const filters = [
        { key: 'all', label: 'All Orders' },
        { key: 'paid', label: 'Paid' },
        { key: 'shipped', label: 'Shipped' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'disputed', label: 'Disputed' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-500/10 text-green-400 border-green-500/20',
            shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            delivered: 'bg-[#7C9A7E]/10 text-[#7C9A7E] border-[#7C9A7E]/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            disputed: "bg-red-500/10 text-red-400 border-red-500/20"
        };
        return styles[status] || styles.pending;
    };


    const handleShip = async () => {
        setUpdating(true);
        try {
            await updateSellerOrders(selectedorder._id, 'shipped', trackingNumber );
            Showmessage('success', 'Order marked as shipped');
            setSelectedorder(null);
            setTrackingNumber('');
            const { orders } = await getsellersOrder();
            setOrders(orders);
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Failed to update');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
            </section>
        );
    }

    const handleResolveDispute = async (orderid, data) => {
        setResolveloading(true)
        try{
            await resolveDispute(orderid, data);
            Showmessage('success', "Dispute resolved")
        }catch(err){
            console.log(err)
            Showmessage("failed", err?.response?.data?.message || "unable to resolve Dispute")
        }finally{
            setResolveloading(false)
        }
    };


    return (
        
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-6xl mx-auto'>

                {/* Header */}
                <article className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
                    <article className='flex items-center gap-4'>
                        <Link to='/dashboard' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                            <ChevronLeft size={20} className='text-[#E8EDE8]' />
                        </Link>
                        <article>
                            <h1 className='text-white text-2xl font-bold'>Orders Received</h1>
                            <p className='text-[#E8EDE8]/50 text-sm'>Manage orders from your buyers</p>
                        </article>
                    </article>

                    {/* Search */}
                    <article className='relative'>
                        <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-[#E8EDE8]/30' />
                        <input
                            type='text'
                            placeholder='Search orders...'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className='w-full sm:w-64 pl-10 pr-4 py-2.5 bg-[#252C26] border border-[#2F3830] rounded-lg text-white text-sm placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors'
                        />
                    </article>
                </article>

                {/* Stats */}
                <article className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-8'>
                    {filters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-xl p-4 text-left transition-all ${
                                filter === f.key
                                    ? 'bg-[#7C9A7E]'
                                    : 'bg-[#252C26] hover:bg-[#2F3830]'
                            }`}
                        >
                            <p className={`text-2xl font-bold ${filter === f.key ? 'text-white' : 'text-white'}`}>
                                {statusCounts[f.key]}
                            </p>
                            <p className={`text-xs mt-1 ${filter === f.key ? 'text-white/70' : 'text-[#E8EDE8]/50'}`}>
                                {f.label}
                            </p>
                        </button>
                    ))}
                </article>

                {/* Orders List */}
                {filterOrders.length === 0 ? (
                    <article className='text-center py-20'>
                        <Package size={48} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                        <p className='text-[#E8EDE8]/50'>No orders found</p>
                    </article>
                ) : (
                    <article className='space-y-4'>
                        {filterOrders.map(order => (
                            <article key={order._id} className='bg-[#252C26] rounded-xl overflow-hidden'>
                                
                                {/* Order Header */}
                                <article className='flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#1A1E1B]'>
                                    <article className='flex items-center gap-3'>
                                        <img
                                            src={order.items?.[0]?.image}
                                            alt={order.items?.[0]?.name}
                                            className='w-12 h-12 rounded-lg object-cover'
                                        />
                                        <article>
                                            <p className='text-white font-semibold text-sm'>
                                                {order.buyer?.name || 'Buyer'}
                                            </p>
                                            <p className='text-[#E8EDE8]/40 text-xs'>
                                                {order.paymentReference 
                                                    ? `Ref: ${order.paymentReference.slice(0, 12)}...`
                                                    : 'No reference'}
                                            </p>
                                        </article>
                                    </article>

                                    <article className='flex items-center gap-5'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.dispute?.status === 'open' 
                                            ? getStatusBadge('disputed') 
                                            : getStatusBadge(order.status)
                                        }`}>
                                            {order.dispute?.status === 'open' ? 'Disputed' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        {order.dispute?.status === 'open' && (
                                            <article className='flex items-center gap-2'>
                                                <button
                                                    disabled={resolveloading}
                                                    onClick={() => handleResolveDispute(order._id, 'resolved')}
                                                    className=' flex justify-center items-center px-3 py-1.5 bg-[#7C9A7E] hover:bg-[#5E7D61] transition-colors text-white text-xs rounded-lg'
                                                >
                                                    {resolveloading ? <Loader2 size={10} className='animate-spin' /> : 'Mark Resolved'}
                                                </button>
                                                <button
                                                    disabled={resolveloading}
                                                    onClick={() => handleResolveDispute(order._id, 'refunded')}
                                                    className=' flex justify-center items-center px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/10 text-yellow-400 text-xs rounded-lg'
                                                >
                                                    {resolveloading ? <Loader2 size={16} className='animate-spin' /> : 'Issue Refund'}
                                                </button>
                                            </article>
                                        )}
                                        <span className='text-[#E8EDE8]/40 text-xs'>
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                        
                                    </article>
                                </article>

                                {/* Order Items */}
                                <article className='p-5 space-y-3'>
                                    {order.items?.map((item, index) => (
                                        <article key={index} className='flex items-center justify-between'>
                                            <article className='flex items-center gap-3'>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className='w-10 h-10 rounded-lg object-cover'
                                                />
                                                <article>
                                                    <p className='text-white text-sm'>{item.name}</p>
                                                    <p className='text-[#E8EDE8]/50 text-xs'>
                                                        Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}
                                                    </p>
                                                </article>
                                            </article>
                                            <p className='text-[#7C9A7E] text-sm font-semibold'>
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </article>
                                    ))}
                                </article>

                                {/* Order Footer */}
                                <article className='border-t border-[#1A1E1B] p-5 flex flex-wrap items-center justify-between gap-3'>
                                    <article>
                                        <p className='text-[#E8EDE8]/50 text-xs'>Shipping to</p>
                                        <p className='text-white text-sm'>
                                            {order.shippingAddress?.name} / {order.shippingAddress?.address}
                                        </p>
                                    </article>

                                    <article className='flex items-center gap-3'>
                                        <p className='text-[#7C9A7E] font-bold'>
                                            ₦{Number(order.totalAmount).toLocaleString()}
                                        </p>

                                        {order.status === 'paid' && (
                                            <button
                                                onClick={() => setSelectedorder(order)}
                                                className='px-4 py-2 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors flex items-center gap-2'
                                            >
                                                <Truck size={16} />
                                                Mark as Shipped
                                            </button>
                                        )}

                                        {order.trackingNumber && (
                                            <p className='text-[#E8EDE8]/40 text-xs'>
                                                Tracking: {order.trackingNumber}
                                            </p>
                                        )}
                                    </article>
                                </article>

                            </article>
                        ))}
                    </article>
                )}

                {/* Ship Modal */}
                {selectedorder && (
                    <>
                        <article className='fixed inset-0 z-50 bg-black/50' onClick={() => setSelectedOrder(null)} />
                        <article className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#252C26] rounded-xl p-6 w-[90%] max-w-md'>
                            <article className='flex items-center justify-between mb-4'>
                                <h3 className='text-white font-semibold text-lg'>Mark as Shipped</h3>
                                <button onClick={() => setSelectedorder(null)} className='text-[#E8EDE8]/50 hover:text-white'>
                                    <X size={20} />
                                </button>
                            </article>

                            <p className='text-[#E8EDE8]/60 text-sm mb-4'>
                                Confirm shipment for order from {selectedorder.buyer?.name}
                            </p>

                            <article className='mb-4'>
                                <label className='block text-[#E8EDE8]/60 text-sm mb-2'>
                                    Tracking Number (optional)
                                </label>
                                <input
                                    type='text'
                                    value={trackingNumber}
                                    onChange={e => setTrackingNumber(e.target.value)}
                                    placeholder='Enter tracking number'
                                    className='w-full px-4 py-2.5 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white text-sm placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors'
                                />
                            </article>

                            <article className='flex gap-3'>
                                <button
                                    onClick={() => setSelectedorder(null)}
                                    className='flex-1 py-2.5 bg-[#1A1E1B] text-[#E8EDE8] text-sm font-semibold rounded-lg hover:bg-[#2F3830] transition-colors'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShip}
                                    disabled={updating}
                                    className='flex-1 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                >
                                    {updating ? <Loader2 size={16} className='animate-spin' /> : <Truck size={16} />}
                                    {updating ? 'Shipping...' : 'Confirm Ship'}
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
    )
}

export default SellerOrder