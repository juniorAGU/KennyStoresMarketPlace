
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Loader2, Send } from 'lucide-react';
import UseAuth from '../Hooks/UseAuth';
import UseMessage from '../Hooks/UseMessage';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { Showmessage, typColo, messages } = UseMessage();
    const {  forgottenPassword } = UseAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Showmessage('failed', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const response = await forgottenPassword(email);
                Showmessage('success', response?.data?.message || "Otp is been sent to your Email")
                console.log("token", response)
                navigate(`/verify-otp?token=${response}`)
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] flex justify-center items-center px-4'>
            <article className='max-w-md w-full'>

                {/* Back */}
                <Link
                    to='/login'
                    className='inline-flex items-center gap-2 text-[#E8EDE8] mb-8 hover:text-[#7C9A7E] transition-colors'
                >
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back to Login</span>
                </Link>

                {/* Header */}
                <article className='mb-8'>
                    <article className='w-14 h-14 bg-[#252C26] rounded-xl flex items-center justify-center mb-4'>
                        <Mail size={24} className='text-[#7C9A7E]' />
                    </article>
                    <h1 className='text-white text-2xl font-bold mb-2'>Forgot Password?</h1>
                    <p className='text-[#E8EDE8]/60 text-sm'>
                        Enter your email address and we'll send you a verification code to reset your password.
                    </p>
                </article>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>
                            Email Address
                        </label>
                        <article className='flex items-center gap-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#7C9A7E] focus-within:border-transparent transition'>
                            <Mail size={18} className='text-[#E8EDE8]/40' />
                            <input
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder='Enter your email'
                                className='bg-transparent text-white w-full outline-none placeholder-[#E8EDE8]/30 text-sm'
                            />
                        </article>
                    </article>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <Loader2 size={18} className='animate-spin' />
                        ) : (
                            <Send size={18} />
                        )}
                        {loading ? 'Sending Code...' : 'Send Reset Code'}
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

export default ForgotPassword;