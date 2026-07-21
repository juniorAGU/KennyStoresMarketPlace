// pages/SellerEarnings.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Wallet, ArrowDown, ArrowUp, Clock, CheckCircle, Loader2, X, DollarSign, CurrencyIcon } from 'lucide-react';
import Usepayout from '../Hooks/Usepayout';
import UseAuth from '../Hooks/UseAuth';
import UseMessage from '../Hooks/UseMessage';

const SellerEarnings = () => {
    const { payout,  Fetchpayouts, putPayouts, payoutloading } = Usepayout();
    const { user } = UseAuth();
    const { Showmessage, typColo, messages } = UseMessage();
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    useEffect(() => {
        if(user?.accountType === 'seller'){
            Fetchpayouts()
        }
    }, [user]);

    const totalEarned = 825000; // Replace with fetched data
    const totalPending = 150000;
    const availableBalance = totalEarned - (payout?.reduce((sum, p) => sum + p.amount, 0) || 0);

    const handleWithdraw = async () => {
        if (!amount || amount <= 0) {
            Showmessage('failed', 'Enter a valid amount');
            return;
        }
        if (Number(amount) > availableBalance) {
            Showmessage('failed', 'Amount exceeds available balance');
            return;
        }
        setWithdrawLoading(true);
        try {
            await putPayouts(Number(amount));
            Showmessage('success', 'Withdrawal request submitted');
            setShowWithdraw(false);
            setAmount('');
            Fetchpayouts();
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Withdrawal failed');
        } finally {
            setWithdrawLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: 'bg-green-500/10 text-green-400 border-green-500/20',
            processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return styles[status] || styles.pending;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle size={16} className='text-green-400' />;
            case 'processing': return <Clock size={16} className='text-blue-400' />;
            case 'pending': return <Clock size={16} className='text-yellow-400' />;
            default: return <Clock size={16} className='text-yellow-400' />;
        }
    };

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-5xl mx-auto'>

                {/* Header */}
                <article className='flex items-center justify-between mb-8'>
                    <article className='flex items-center gap-4'>
                        <Link to='/dashboard' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                            <ChevronLeft size={20} className='text-[#E8EDE8]' />
                        </Link>
                        <article>
                            <h1 className='text-white text-2xl font-bold'>Earnings</h1>
                            <p className='text-[#E8EDE8]/50 text-sm'>Manage your payouts and withdrawals</p>
                        </article>
                    </article>
                    {user?.paystackRecipientCode ? (
                        <button
                            onClick={() => setShowWithdraw(true)}
                            className='px-5 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors flex items-center gap-2'
                        >
                            <Wallet size={18} />
                            Request Withdrawal
                        </button>
                    ) : (
                        <Link
                            to='/profile/edit'
                            className='px-5 py-2.5 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-lg hover:bg-yellow-500/30 transition-colors'
                        >
                            Add Bank Details to Withdraw
                        </Link>
                    )}
                </article>

                {/* Stats Cards */}
                <article className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <article className='bg-[#252C26] rounded-xl p-6'>
                        <article className='flex items-center gap-3 mb-3'>
                            <article className='w-10 h-10 bg-[#7C9A7E]/10 rounded-lg flex items-center justify-center'>
                                <DollarSign size={20} className='text-[#7C9A7E]' />
                            </article>
                            <p className='text-[#E8EDE8]/60 text-sm'>Total Earned</p>
                        </article>
                        <p className='text-white text-2xl font-bold'>₦{totalEarned.toLocaleString()}</p>
                    </article>

                    <article className='bg-[#252C26] rounded-xl p-6'>
                        <article className='flex items-center gap-3 mb-3'>
                            <article className='w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center'>
                                <Clock size={20} className='text-yellow-400' />
                            </article>
                            <p className='text-[#E8EDE8]/60 text-sm'>Pending Clearance</p>
                        </article>
                        <p className='text-white text-2xl font-bold'>₦{totalPending.toLocaleString()}</p>
                    </article>

                    <article className='bg-[#252C26] rounded-xl p-6'>
                        <article className='flex items-center gap-3 mb-3'>
                            <article className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center'>
                                <ArrowDown size={20} className='text-green-400' />
                            </article>
                            <p className='text-[#E8EDE8]/60 text-sm'>Available for Withdrawal</p>
                        </article>
                        <p className='text-[#7C9A7E] text-2xl font-bold'>₦{availableBalance.toLocaleString()}</p>
                    </article>
                </article>

                {/* Withdrawal History */}
                <article className='bg-[#252C26] rounded-xl overflow-hidden'>
                    <article className='p-5 border-b border-[#1A1E1B]'>
                        <h3 className='text-white font-semibold'>Withdrawal History</h3>
                    </article>

                    {!payout || payout.length === 0 ? (
                        <article className='text-center py-16'>
                            <Wallet size={48} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                            <p className='text-[#E8EDE8]/50'>No withdrawals yet</p>
                        </article>
                    ) : (
                        <article className='divide-y divide-[#1A1E1B]'>
                            {/* Table Header */}
                            <article className='hidden md:grid grid-cols-4 gap-4 px-5 py-3 text-[#E8EDE8]/50 text-xs uppercase tracking-wider'>
                                <p>Date</p>
                                <p>Amount</p>
                                <p>Reference</p>
                                <p>Status</p>
                            </article>

                            {payout.map(payout => (
                                <article key={payout._id} className='px-5 py-4 hover:bg-[#1A1E1B]/50 transition-colors'>
                                    <article className='md:grid md:grid-cols-4 gap-4 items-center'>
                                        <p className='text-[#E8EDE8]/60 text-sm mb-1 md:mb-0'>
                                            {new Date(payout.createdAt || payout.requestedAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </p>
                                        <p className='text-white font-semibold mb-1 md:mb-0'>
                                            ₦{payout.amount?.toLocaleString()}
                                        </p>
                                        <p className='text-[#E8EDE8]/40 text-xs font-mono mb-1 md:mb-0 truncate'>
                                            {payout.paymentRef || payout.paystackTransferRef || 'N/A'}
                                        </p>
                                        <article className='flex items-center gap-2'>
                                            {getStatusIcon(payout.status)}
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(payout.status)}`}>
                                                {payout.status?.charAt(0).toUpperCase() + payout.status?.slice(1)}
                                            </span>
                                        </article>
                                    </article>
                                </article>
                            ))}
                        </article>
                    )}
                </article>

            </article>

            {/* Withdraw Modal */}
            {showWithdraw && (
                <>
                    <article className='fixed inset-0 z-50 bg-black/50' onClick={() => setShowWithdraw(false)} />
                    <article className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#252C26] rounded-xl p-6 w-[90%] max-w-md'>
                        <article className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-semibold text-lg'>Request Withdrawal</h3>
                            <button onClick={() => setShowWithdraw(false)} className='text-[#E8EDE8]/50 hover:text-white'>
                                <X size={20} />
                            </button>
                        </article>

                        <article className='mb-4'>
                            <article className='flex justify-between text-sm mb-2'>
                                <span className='text-[#E8EDE8]/60'>Available Balance</span>
                                <span className='text-[#7C9A7E] font-semibold'>₦{availableBalance.toLocaleString()}</span>
                            </article>
                            <label className='block text-[#E8EDE8]/60 text-sm mb-2'>Amount</label>
                            <article className='relative'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#E8EDE8]/40'>₦</span>
                                <input
                                    type='number'
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder='0.00'
                                    min={1}
                                    className='w-full pl-8 pr-4 py-3 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white text-lg placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors'
                                />
                            </article>
                        </article>

                        <article className='flex gap-3'>
                            <button
                                onClick={() => setShowWithdraw(false)}
                                className='flex-1 py-2.5 bg-[#1A1E1B] text-[#E8EDE8] text-sm font-semibold rounded-lg hover:bg-[#2F3830] transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={withdrawLoading}
                                className='flex-1 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                            >
                                {withdrawLoading ? <Loader2 size={16} className='animate-spin' /> : <Wallet size={16} />}
                                {withdrawLoading ? 'Processing...' : 'Withdraw'}
                            </button>
                        </article>
                    </article>
                </>
            )}

            {messages && (
                <article className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]}`}>
                    {messages.message}
                </article>
            )}
        </section>
    );
};

export default SellerEarnings;