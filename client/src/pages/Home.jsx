import React from 'react';
import { useState,useEffect } from 'react';
import Logo from '../Components/Logo';
import { Menu, X,ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { motion, scale } from 'framer-motion';
import WhyTrustUs from '../Components/WhyTrustUs';
import HowItWorks from '../Components/HowitWorks';
import Categories from '../Components/Categories';
import UseAuth from '../Hooks/UseAuth';
import UserDropdown from '../Components/UserDropdown';
import UseCart from '../Hooks/UseCart';

function Home() {

    const [isopen, setIsopen] = useState(false);
    const { isAuthenticated, user} = UseAuth();
    const {cart, FetchCart} = UseCart();

    const cartLenght = cart?.items?.lenght || 0;

    useEffect(() => {
        FetchCart();
    }, []);
    


    return (
        <section className='bg-[#1A1E1B]'>
            <header className='fixed top-0 left-0 right-0 z-50 bg-[#1A1E1B]/95 backdrop-blur-sm border-b border-[#252C26]'>
                <article className='max-w-7xl mx-auto flex items-center justify-start gap-3 px-4 py-4'>
                    <button 
                        onClick={() => setIsopen(!isopen)}
                        className='text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'
                    >
                        {isopen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Logo />

                    <article className=' flex items-center gap-3 ml-auto'>
                        {
                            isAuthenticated && user.accountType === "buyer"
                            ? <Link to='/cart' className='relative'>
                                    <ShoppingBasket size={25} />
                                    {cartLenght > 0 && (
                                        <span className='absolute -top-2 -right-2 w-5 h-5 bg-[#7C9A7E] text-white text-xs rounded-full flex items-center justify-center'>
                                            {cartLenght}
                                        </span>
                                    )}
                                </Link>
                            : ""
                        }

                        {
                            isAuthenticated 
                            ? ( <UserDropdown user={user} />)
                            :(
                                <>
                                    <motion.article
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 1.95}}
                                        >

                                            <Link 
                                            to={'/login'}
                                            className='text-sm text-[#E8EDE8] hover:text-white transition-colors'
                                        >
                                            Sign in

                                        </Link>

                                        </motion.article>

                                        <motion.article
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 1.95}}
                                        >

                                            <Link 
                                                to={'register'}
                                                className='text-sm px-4 py-2 bg-[#7C9A7E] text-white rounded-lg hover:bg-[#5E7D61] transition-colors'
                                            >
                                                Sign up
                                            </Link>

                                        </motion.article>
                                </>
                            )
                        }

                    </article>
                </article>
            </header>

            {
                isopen && (
                    <article  
                        className='fixed inset-0 z-40 bg-black/50'
                        onClick={() => setIsopen(false)}
                    />
                )
            }

            <aside 
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#252C26] transform transition-transform duration-300 ease-in-out ${
                isopen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <article 
                    className='p-6 pt-20'
                >
                    <button 
                        onClick={() => setIsopen(!isopen)}
                        className='text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors ml-[79%] mb-10'
                    >
                        {isopen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Navbar isopen={isopen}
                    setIsopen={setIsopen}/>

                </article>
            </aside>

            <article className='bg-[#1A1E1B] pt-24 pb-16 px-4'>
                <article className='max-w-4xl mx-auto text-center space-y-6'>
                    <h1 className='space-y-4 text-left'>
                        <span className='block text-[#E8EDE8] text-4xl md:text-5xl font-bold'>
                            Buy & Sell With Ease
                        </span>
                        <span className='block text-[#E8EDE8] text-4xl md:text-5xl font-bold'>
                            Your Marketplace, Your Rules
                        </span>
                        <span className='block text-[#E8EDE8] text-4xl md:text-5xl font-bold'>
                            Discover Unique Products From Verified Sellers
                        </span>
                    </h1>

                    <p className='text-[#E8EDE8]/80 text-lg max-w-2xl mx-auto leading-relaxed'>
                        Join thousands of buyers and sellers in the fastest growing marketplace. 
                        Start shopping or open your store today. Tested, Approved and Trusted.
                    </p>

                    

                    <motion.Link
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 1.95}}
                        to={'/register'} 
                        className='inline-block px-8 py-4 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors text-lg'
                    >
                        Get Started - It's Free
                    </motion.Link>

                </article>

            </article>

            <article className=' mb-8'>
                <WhyTrustUs />
            </article>

            <article className=' mb-8'>

                <HowItWorks />

            </article>

            <article className='w-full mb-8'>
                <Categories />
            </article>

            <footer className='bg-[#252C26] border-t border-[#1A1E1B]'>
            <article className='max-w-7xl mx-auto px-4 py-12 md:py-16'>
                
                <article className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
                    
                    {/* Brand */}
                    <article className='col-span-2 md:col-span-1'>
                        <Logo />
                        <p className='text-[#E8EDE8]/60 text-sm mt-4 leading-relaxed'>
                            Buy and sell with confidence. The marketplace built on trust.
                        </p>
                    </article>

                    {/* Links */}
                    <article>
                        <h4 className='text-white text-sm font-semibold mb-4'>Marketplace</h4>
                        <article className='space-y-3'>
                            <Link to={'/marketplace'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Browse All</Link>
                            <Link to={'/categories'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Categories</Link>
                            <Link to={'/sellers'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Top Sellers</Link>
                        </article>
                    </article>

                    <article>
                        <h4 className='text-white text-sm font-semibold mb-4'>Company</h4>
                        <article className='space-y-3'>
                            <Link to={'/about'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>About</Link>
                            <Link to={'/contact'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Contact</Link>
                            <Link to={'/how-it-works'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>How It Works</Link>
                        </article>
                    </article>

                    <article>
                        <h4 className='text-white text-sm font-semibold mb-4'>Account</h4>
                        <article className='space-y-3'>
                            <Link to={'/login'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Sign In</Link>
                            <Link to={'/register'} className='block text-[#E8EDE8]/60 text-sm hover:text-white  transition-colors'>Create Account</Link>
                        </article>
                    </article>

                </article>

                {/* Bottom bar */}
                <article className='border-t border-[#1A1E1B] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-[#E8EDE8]/40 text-xs'>
                        &copy; {new Date().getFullYear()} Kennystores. All rights reserved.
                    </p>
                    <article className='flex items-center gap-6'>
                        <Link to={'/privacy'} className='text-[#E8EDE8]/40 text-xs hover:text-white  transition-colors'>Privacy</Link>
                        <Link to={'/terms'} className='text-[#E8EDE8]/40 text-xs hover:text-white  transition-colors'>Terms</Link>
                    </article>
                </article>

            </article>
        </footer>

            


        </section>
    )
}

export default Home