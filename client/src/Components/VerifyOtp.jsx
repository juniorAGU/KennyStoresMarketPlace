// pages/VerifyOTP.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Loader2 } from 'lucide-react';
import UseAuth from '../Hooks/UseAuth';
import UseMessage from '../Hooks/UseMessage';

const VerifyOTP = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { Showmessage, typColo, messages } = UseMessage();
    const { verification } = UseAuth()

    const [otps, setOtps] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    console.log("token", token)
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; 

        const newOtp = [...otps];
        newOtp[index] = value;
        setOtps(newOtp);

        
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        
        if (e.key === 'Backspace' && !otps[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d{6}$/.test(pasted)) return;

        const newOtp = pasted.split('');
        setOtps(newOtp);
        inputRefs.current[5]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = otps.join('');

        if (otp.length !== 6) {
            Showmessage('failed', 'Please enter the complete 6-digit code');
            return;
        }

        if (!token) {
            Showmessage('failed', 'Invalid reset link');
            return;
        }

        setLoading(true);
        try {
            const response = await verification(token, otp  );
            Showmessage('success', 'Code verified');
            navigate(`/reset-password?token=${response}`);
        } catch (err) {
            Showmessage('failed', err?.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    // Redirect if no token
    if (!token) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] flex justify-center items-center px-4'>
                <article className='max-w-md w-full text-center'>
                    <article className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <ShieldCheck size={32} className='text-red-400' />
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
                    to='/forgot-password'
                    className='inline-flex items-center gap-2 text-[#E8EDE8] mb-8 hover:text-[#7C9A7E] transition-colors'
                >
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back</span>
                </Link>

                {/* Header */}
                <article className='mb-8'>
                    <article className='w-14 h-14 bg-[#252C26] rounded-xl flex items-center justify-center mb-4'>
                        <ShieldCheck size={24} className='text-[#7C9A7E]' />
                    </article>
                    <h1 className='text-white text-2xl font-bold mb-2'>Verify Code</h1>
                    <p className='text-[#E8EDE8]/60 text-sm'>
                        Enter the 6-digit code sent to your email. Code expires in 2 minutes.
                    </p>
                </article>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* OTP Inputs */}
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-4 text-center'>
                            Verification Code
                        </label>
                        <article className='flex justify-center gap-3'>
                            {otps.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type='text'
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(index, e.target.value)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className='w-12 h-14 bg-[#252C26] border-2 border-[#2F3830] rounded-lg text-white text-xl font-bold text-center focus:outline-none focus:border-[#7C9A7E] transition-colors'
                                />
                            ))}
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
                            <ShieldCheck size={18} />
                        )}
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                <p className='text-center text-[#E8EDE8]/40 text-xs mt-6'>
                    Didn't receive the code?{' '}
                    <Link to='/forgot-password' className='text-[#7C9A7E] hover:underline'>
                        Resend
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

export default VerifyOTP;