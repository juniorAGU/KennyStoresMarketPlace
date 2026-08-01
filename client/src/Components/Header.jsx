// components/Header.jsx
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X,ShoppingBasket } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import Navbar from './Navbar';
import UseAuth from '../Hooks/UseAuth';
import UserDropdown from './UserDropdown';
import UseCart from '../Hooks/UseCart';

const Header = () => {
    const [isopen, setIsopen] = useState(false);
    const { isAuthenticated, user} = UseAuth();

    const {cart, FetchCart} = UseCart();

    const cartLenght = cart?.items?.lenght || 0;

    useEffect(() => {
        FetchCart();
    }, []);

    return (
        <>
            <header className='fixed top-0 left-0 right-0 z-50 bg-[#1A1E1B]/95 backdrop-blur-sm border-b border-[#252C26]'>
                <article className='max-w-7xl mx-auto flex items-center justify-start gap-3 px-4 py-4'>
                    <button 
                        onClick={() => setIsopen(!isopen)}
                        className='text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'
                    >
                        {isopen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to={'/'}>
                        <Logo />
                    </Link>

                    <article className='flex items-center gap-3 ml-auto'>
                        {
                            isAuthenticated && user.accountType === "buyer"
                            ? <Link to='/cart' className='relative'>
                                    <ShoppingBasket size={25} className='text-[#7C9A7E]'/>
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

            {/* Overlay */}
            {isopen && (
                <article  
                    className='fixed inset-0 z-40 bg-black/50'
                    onClick={() => setIsopen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#252C26] transform transition-transform duration-300 ease-in-out ${
                    isopen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <article className='p-6 pt-20'>
                    <button 
                        onClick={() => setIsopen(false)}
                        className='text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors ml-[79%] mb-10'
                    >
                        <X size={24} />
                    </button>
                    <Navbar isopen={isopen} setIsopen={setIsopen}/>
                </article>
            </aside>
        </>
    );
};

export default Header;