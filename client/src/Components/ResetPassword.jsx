import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import UseMessage from '../Hooks/UseMessage';
import UseAuth from '../Hooks/UseAuth';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const { passwordReset } = UseAuth();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { Showmessage, typColo, messages } = UseMessage();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            Showmessage('failed', 'Please fill in both fields');
            return;
        }

        if (password.length < 6) {
            Showmessage('failed', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Showmessage('failed', 'Passwords do not match');
            return;
        }

        if (!token) {
            Showmessage('failed', 'Invalid or expired reset link');
            return;
        }

        setLoading(true);
        try {
            const response = await passwordReset(token, password);
            Showmessage('success', response)
            setSuccess(true);
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Reset failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (success) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] flex justify-center items-center px-4'>
                <article className='max-w-md w-full text-center'>
                    <article className='w-16 h-16 bg-[#7C9A7E]/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <ShieldCheck size={32} className='text-[#7C9A7E]' />
                    </article>
                    <h1 className='text-white text-2xl font-bold mb-2'>Password Reset!</h1>
                    <p className='text-[#E8EDE8]/60 mb-8'>
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>
                    <Link
                        to='/login'
                        className='inline-block w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors'
                    >
                        Sign In
                    </Link>
                </article>
            </section>
        );
    }

    // Invalid token
    if (!token) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] flex justify-center items-center px-4'>
                <article className='max-w-md w-full text-center'>
                    <article className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <Lock size={32} className='text-red-400' />
                    </article>
                    <h1 className='text-white text-2xl font-bold mb-2'>Invalid Link</h1>
                    <p className='text-[#E8EDE8]/60 mb-6'>This reset link is invalid or has expired.</p>
                    <Link to='/forgot-password' className='text-[#7C9A7E] hover:underline'>
                        Request a new code
                    </Link>
                </article>
            </section>
        );
    }

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] flex justify-center items-center px-4'>
            <article className='max-w-md w-full'>

                {/* Back */}
                <Link
                    to='/verify-otp'
                    className='inline-flex items-center gap-2 text-[#E8EDE8] mb-8 hover:text-[#7C9A7E] transition-colors'
                >
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back</span>
                </Link>

                {/* Header */}
                <article className='mb-8'>
                    <article className='w-14 h-14 bg-[#252C26] rounded-xl flex items-center justify-center mb-4'>
                        <Lock size={24} className='text-[#7C9A7E]' />
                    </article>
                    <h1 className='text-white text-2xl font-bold mb-2'>Reset Password</h1>
                    <p className='text-[#E8EDE8]/60 text-sm'>
                        Enter your new password below.
                    </p>
                </article>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* New Password */}
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>
                            New Password
                        </label>
                        <article className='relative'>
                            <article className='flex items-center gap-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#7C9A7E] focus-within:border-transparent transition'>
                                <Lock size={18} className='text-[#E8EDE8]/40' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder='Enter new password'
                                    className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                                />
                            </article>
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#E8EDE8]/40 hover:text-[#E8EDE8]'
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </article>
                        <p className='text-[#E8EDE8]/30 text-xs mt-1'>Must be at least 6 characters</p>
                    </article>

                    {/* Confirm Password */}
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>
                            Confirm Password
                        </label>
                        <article className='relative'>
                            <article className='flex items-center gap-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#7C9A7E] focus-within:border-transparent transition'>
                                <Lock size={18} className='text-[#E8EDE8]/40' />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm new password'
                                    className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                                />
                            </article>
                            <button
                                type='button'
                                onClick={() => setShowConfirm(!showConfirm)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#E8EDE8]/40 hover:text-[#E8EDE8]'
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </article>
                    </article>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                        <article className={`flex items-center gap-2 text-xs ${
                            password === confirmPassword ? 'text-green-400' : 'text-red-400'
                        }`}>
                            <article className={`w-2 h-2 rounded-full ${
                                password === confirmPassword ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                        </article>
                    )}

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <Loader2 size={18} className='animate-spin' />
                        ) : (
                            <Lock size={18} />
                        )}
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className='text-center text-[#E8EDE8]/40 text-xs mt-6'>
                    Remember your password?{' '}
                    <Link to='/login' className='text-[#7C9A7E] hover:underline'>
                        Sign in
                    </Link>
                </p>

            </article>

            {messages && (
                <article className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]}`}>
                    {messages.message}
                </article>
            )}
        </section>
    );
};

export default ResetPassword;