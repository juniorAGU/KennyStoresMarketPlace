// pages/Settings.jsx
import { useState } from 'react';
import { data, Link } from 'react-router-dom';
import { ChevronLeft, User, Lock, RefreshCw, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import UseAuth from '../Hooks/UseAuth';
import UseMessage from '../Hooks/UseMessage';

const Settings = () => {
    const { user, updatePassword, updateAccountType } = UseAuth();
    const { Showmessage, typColo, messages } = UseMessage();

    
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    
    const [accountTypeLoading, setAccountTypeLoading] = useState(false);
    const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]:value
        })
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            Showmessage('failed', 'All password fields are required');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Showmessage('failed', 'Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            Showmessage('failed', 'Password must be at least 6 characters');
            return;
        }
        if(!/[A-Z]/.test(passwordData.newPassword)){
            Showmessage('failed', "password must contain atleast one capital letter");
            return
        }
        setPasswordLoading(true);
        try {
            const success = await updatePassword( passwordData.newPassword, passwordData.oldPassword,);
            
            if(success){
                Showmessage('success', 'Password updated successfully');
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
            
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSwitchAccountType = async () => {
        setAccountTypeLoading(true);
        try {
            await updateAccountType();
            Showmessage('success', `Switched to ${user?.accountType === 'seller' ? 'buyer' : 'seller'} account`);
            setShowSwitchConfirm(false);
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Failed to switch account type');
        } finally {
            setAccountTypeLoading(false);
        }
    };

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-3xl mx-auto'>

                {/* Header */}
                <article className='flex items-center gap-4 mb-8'>
                    <Link to='/' className='p-2 bg-[#252C26] rounded-lg hover:bg-[#1A1E1B] transition-colors'>
                        <ChevronLeft size={20} className='text-[#E8EDE8]' />
                    </Link>
                    <article>
                        <h1 className='text-white text-2xl font-bold'>Settings</h1>
                        <p className='text-[#E8EDE8]/50 text-sm'>Manage your account preferences</p>
                    </article>
                </article>

                <article className='space-y-6'>

                    {/* Change Password */}
                    <article className='bg-[#252C26] rounded-xl p-6 md:p-8'>
                        <article className='flex items-center gap-3 mb-6'>
                            <article className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center'>
                                <Lock size={20} className='text-blue-400' />
                            </article>
                            <article>
                                <h2 className='text-white font-semibold'>Change Password</h2>
                                <p className='text-[#E8EDE8]/50 text-xs'>Update your account password</p>
                            </article>
                        </article>

                        <form onSubmit={handlePasswordSubmit} className='space-y-4'>
                            <article className='relative'>
                                <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Current Password</label>
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    name='oldPassword'
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    placeholder='Enter current password'
                                    className='w-full px-4 py-3 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors pr-12'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className='absolute right-3 top-9 text-[#E8EDE8]/40 hover:text-[#E8EDE8]'
                                >
                                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </article>

                            <article className='relative'>
                                <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>New Password</label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name='newPassword'
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder='Enter new password'
                                    className='w-full px-4 py-3 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors pr-12'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className='absolute right-3 top-9 text-[#E8EDE8]/40 hover:text-[#E8EDE8]'
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </article>

                            <article>
                                <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Confirm New Password</label>
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder='Confirm new password'
                                    className='w-full px-4 py-3 bg-[#1A1E1B] border border-[#2F3830] rounded-lg text-white placeholder-[#E8EDE8]/30 focus:outline-none focus:border-[#7C9A7E] transition-colors'
                                />
                            </article>

                            <button
                                type='submit'
                                disabled={passwordLoading}
                                className='w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                            >
                                {passwordLoading ? <Loader2 size={18} className='animate-spin' /> : <Lock size={18} />}
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </article>

                    {/* Switch Account Type */}
                    <article className='bg-[#252C26] rounded-xl p-6 md:p-8'>
                        <article className='flex items-center gap-3 mb-6'>
                            <article className='w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center'>
                                <RefreshCw size={20} className='text-purple-400' />
                            </article>
                            <article>
                                <h2 className='text-white font-semibold'>Switch Account Type</h2>
                                <p className='text-[#E8EDE8]/50 text-xs'>Change between buyer and seller</p>
                            </article>
                        </article>

                        <article className='bg-[#1A1E1B] rounded-lg p-4 mb-4'>
                            <article className='flex items-center justify-between'>
                                <article>
                                    <p className='text-white text-sm font-medium'>Current Account</p>
                                    <p className='text-[#7C9A7E] text-xs capitalize'>{user?.accountType || 'buyer'}</p>
                                </article>
                                <article className='w-10 h-10 bg-[#7C9A7E]/10 rounded-full flex items-center justify-center'>
                                    <Shield size={20} className='text-[#7C9A7E]' />
                                </article>
                            </article>
                        </article>

                        <button
                            onClick={() => setShowSwitchConfirm(true)}
                            className='w-full py-3 border border-[#7C9A7E] text-[#7C9A7E] font-semibold rounded-lg hover:bg-[#7C9A7E] hover:text-white transition-colors flex items-center justify-center gap-2'
                        >
                            <RefreshCw size={18} />
                            Switch to {user?.accountType === 'seller' ? 'Buyer' : 'Seller'} Account
                        </button>
                    </article>

                    {/* Account Info */}
                    <article className='bg-[#252C26] rounded-xl p-6 md:p-8'>
                        <article className='flex items-center gap-3 mb-6'>
                            <article className='w-10 h-10 bg-[#7C9A7E]/10 rounded-lg flex items-center justify-center'>
                                <User size={20} className='text-[#7C9A7E]' />
                            </article>
                            <article>
                                <h2 className='text-white font-semibold'>Account Information</h2>
                                <p className='text-[#E8EDE8]/50 text-xs'>Your basic account details</p>
                            </article>
                        </article>

                        <article className='space-y-3'>
                            <article className='flex justify-between py-3 border-b border-[#1A1E1B]'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Name</span>
                                <span className='text-white text-sm'>{user?.name || 'N/A'}</span>
                            </article>
                            <article className='flex justify-between py-3 border-b border-[#1A1E1B]'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Email</span>
                                <span className='text-white text-sm'>{user?.email || 'N/A'}</span>
                            </article>
                            <article className='flex justify-between py-3 border-b border-[#1A1E1B]'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Role</span>
                                <span className='text-white text-sm capitalize'>{user?.role || 'User'}</span>
                            </article>
                            <article className='flex justify-between py-3'>
                                <span className='text-[#E8EDE8]/60 text-sm'>Member Since</span>
                                <span className='text-white text-sm'>
                                    {user?.createdAt 
                                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                        : 'N/A'}
                                </span>
                            </article>
                        </article>
                    </article>

                </article>

            </article>

            {/* Switch Account Confirmation Modal */}
            {showSwitchConfirm && (
                <>
                    <article className='fixed inset-0 z-50 bg-black/50' onClick={() => setShowSwitchConfirm(false)} />
                    <article className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#252C26] rounded-xl p-6 w-[90%] max-w-sm'>
                        <article className='text-center mb-4'>
                            <article className='w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                                <RefreshCw size={28} className='text-purple-400' />
                            </article>
                            <h3 className='text-white font-semibold text-lg'>Switch Account Type?</h3>
                            <p className='text-[#E8EDE8]/60 text-sm mt-2'>
                                You are about to switch to a {user?.accountType === 'seller' ? 'buyer' : 'seller'} account. 
                                You can switch back anytime.
                            </p>
                        </article>
                        <article className='flex gap-3'>
                            <button
                                onClick={() => setShowSwitchConfirm(false)}
                                className='flex-1 py-2.5 bg-[#1A1E1B] text-[#E8EDE8] text-sm font-semibold rounded-lg hover:bg-[#2F3830] transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSwitchAccountType}
                                disabled={accountTypeLoading}
                                className='flex-1 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                            >
                                {accountTypeLoading ? <Loader2 size={16} className='animate-spin' /> : <RefreshCw size={16} />}
                                {accountTypeLoading ? 'Switching...' : 'Confirm Switch'}
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

export default Settings;