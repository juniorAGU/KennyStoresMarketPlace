
import { TrendingUp, Package, ShoppingBag, DollarSign, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { dashBoard } from '../Services/OrderServces';
import UseMessage from '../Hooks/UseMessage';
import UseAuth from '../Hooks/UseAuth';

const SellerDashboard = () => {
    const [stat, setStat ] = useState({
        totalSales: 0,
        activeProducts: 0,
        recentOrders: [],
        totalEarnings: 0,
        orders: 0
    });
    const [statloading, setStatloading] = useState(true);
    const {messages, Showmessage,typColo} = UseMessage();
    const {user } = UseAuth();

    useEffect(()=> {
        if(!user || user?.accountType === 'seller'){
            dashBoard()
            .then(({stats}) => {
                setStat(stats)
            })
            .catch(err => {
                console.log(err)
                Showmessage('failed', err?.response?.data?.message || "unable to fetch dashboard")
            })
            .finally(
                () => setStatloading(false)
            )
        }
    },[user])

    console.log(stat)

    const stats = [
        { label: 'Total Sales', value: stat.totalSales, icon: TrendingUp, change: '+12%' },
        { label: 'Active Products', value: stat.activeProducts, icon: Package, change: 'new' },
        { label: 'Orders Received', value: stat.orders, icon: ShoppingBag, change: '+8%' },
        { label: 'Earnings', value: `₦${Number(stat.totalEarnings).toLocaleString()}`, icon: DollarSign, change: '+18%' },
    ];


    const quickActions = [
        { label: 'Add New Product', to: '/addproduct', color: 'bg-[#7C9A7E] hover:bg-[#5E7D61]' },
        { label: 'Manage Products', to: '/myproducts', color: 'bg-[#252C26] hover:bg-[#1A1E1B] border border-[#7C9A7E]' },
        { label: 'View Payouts', to: '/dashboard/payouts', color: 'bg-[#252C26] hover:bg-[#1A1E1B] border border-[#7C9A7E]' },
    ];

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-6xl mx-auto'>

                {/* Header */}
                <article className='mb-8'>
                    <h1 className='text-white text-2xl md:text-3xl font-bold'>Seller Dashboard</h1>
                    <p className='text-[#E8EDE8]/60 text-sm mt-1'>Welcome back! Here's what's happening with your store.</p>
                </article>

                {/* Stats Grid */}
                <article className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                    {stats.map((stat, index) => (
                        <article key={index} className='bg-[#252C26] rounded-xl p-5 border border-[#252C26]'>
                            <article className='flex items-center justify-between mb-3'>
                                <stat.icon size={20} className='text-[#7C9A7E]' />
                                <span className='text-[#7C9A7E] text-xs font-medium'>{stat.change}</span>
                            </article>
                            <p className='text-white text-2xl font-bold'>{stat.value}</p>
                            <p className='text-[#E8EDE8]/50 text-xs mt-1'>{stat.label}</p>
                        </article>
                    ))}
                </article>

                {/* Quick Actions */}
                <article className='flex flex-wrap gap-3 mb-8'>
                    {quickActions.map((action, index) => (
                        <Link 
                            key={index}
                            to={action.to}
                            className={`px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${action.color}`}
                        >
                            {action.label}
                        </Link>
                    ))}
                </article>

                <article className='grid lg:grid-cols-2 gap-6'>
                    
                    {/* Recent Orders */}
                    <article className='bg-[#252C26] rounded-xl p-5 border border-[#252C26]'>
                        <article className='flex items-center justify-between mb-4'>
                            <h2 className='text-white font-semibold'>Recent Orders</h2>
                            <Link to='/sellerOrders' className='text-[#7C9A7E] text-xs hover:underline'>View All</Link>
                        </article>
                        
                        <article className='space-y-3'>
                            {stat.recentOrders.map((order, index) => {
                                return(
                                    <article key={order._id} className='flex items-center justify-between py-3 border-b border-[#1A1E1B] last:border-0'>
                                    <article>
                                        <p className='text-white text-sm font-medium'>{order.items?.[0]?.name}</p>
                                        <p className='text-[#E8EDE8]/50 text-xs'>{order._id.toString().slice(-8)} • {order.buyer?.name}</p>
                                    </article>
                                    <article className='text-right'>
                                        <p className='text-white text-sm font-semibold'>₦{Number(order?.totalAmount).toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.status === 'delivered' ? 'bg-purple-500/20 text-purple-400' :
                                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                                            order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </article>
                                </article>
                                )
                                
                            })}
                        </article>
                    </article>

                    {/* Earnings Overview */}
                    <article className='bg-[#252C26] rounded-xl p-5 border border-[#252C26]'>
                        <article className='flex items-center justify-between mb-4'>
                            <h2 className='text-white font-semibold'>Earnings Overview</h2>
                            <Link to='/dashboard/earnings' className='text-[#7C9A7E] text-xs hover:underline'>Details</Link>
                        </article>

                        <article className='space-y-4'>
                            <article className='flex items-center justify-between'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Total Earnings</span>
                                <span className='text-white font-bold text-lg'>₦{stat.totalEarnings.toLocaleString()}</span>
                            </article>
                            <article className='flex items-center justify-between'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Pending Payouts</span>
                                <span className='text-yellow-400 font-semibold'>₦1,250</span>
                            </article>
                            <article className='flex items-center justify-between'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Available for Withdrawal</span>
                                <span className='text-[#7C9A7E] font-semibold'>₦7,070</span>
                            </article>
                        </article>

                        <article className='border-t border-[#1A1E1B] mt-5 pt-5'>
                            <article className='flex items-center gap-3'>
                                <Wallet size={20} className='text-[#7C9A7E]' />
                                <article>
                                    <p className='text-white text-sm font-medium'>Ready to cash out?</p>
                                    <p className='text-[#E8EDE8]/50 text-xs'>Withdraw your earnings to your bank account.</p>
                                </article>
                            </article>
                            <Link 
                                to='/dashboard/payouts'
                                className='block w-full mt-4 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors text-center'
                            >
                                Request Payout
                            </Link>
                        </article>
                    </article>

                </article>

            </article>
        </section>
    );
};

export default SellerDashboard;