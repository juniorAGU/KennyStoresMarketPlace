import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import UseAuth from '../Hooks/UseAuth';
import { useEffect } from 'react';
import {X,ShoppingBasket, House,ClockArrowUp,LayoutDashboard,Trophy, Handbag,CirclePlus,History, Info,Contact,Package,  CurrencyIcon} from 'lucide-react'

function Navbar({setIsopen,isopen}) {

    const {isAuthenticated, user} = UseAuth();


    return (
        <nav className='space-y-4'>
            <NavLink 
                to={'/'} 
                className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                onClick={() => setIsopen(false)}
            >
                <House size={20}/>
                Home
            </NavLink>
            <NavLink 
                to={'/marketplace'} 
                className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                onClick={() => setIsopen(false)}
            >
                <Handbag size={20}/>
                Browse Products
            </NavLink>

            {/* sellers nav links */}
            {
                user?.accountType === "seller" ?
                    <>
                        <NavLink 
                            to={'/dashboard'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <LayoutDashboard size={20}/>
                            Dashboard
                        </NavLink>

                        <NavLink 
                            to={'/addproduct'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <CirclePlus size={20}/>
                            AddProduct
                        </NavLink>

                        <NavLink 
                            to={'/myproducts'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <Package size={20}/>
                            MyProducts
                        </NavLink>

                        <NavLink 
                            to={'/sellers'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <Trophy size={20}/>
                            Top Sellers
                        </NavLink>

                        
                        <NavLink 
                            to={'/sellerOrders'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <History size={20}/>
                            My Orders
                        </NavLink>

                        <NavLink 
                            to={'/earnings'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            < CurrencyIcon size={20}/>
                            My Earnings
                        </NavLink>
                    </> : ""
            }
            {/* End of Sellers page */}

            {/* buyers page */}
            {
                user?.accountType === "buyer" ?
                    <>
                        <NavLink 
                            to={'/cart'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <ShoppingBasket size={20}/>
                            My Cart
                        </NavLink>
                        <NavLink 
                            to={'/orders'} 
                            className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                            : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                            onClick={() => setIsopen(false)}
                        >
                            <History size={20}/>
                            My Orders
                        </NavLink>
                    </>
                    : ""
            }
            {/* end of buyers route */}


            <NavLink 
                to={'/about'} 
                className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                onClick={() => setIsopen(false)}
            >
                <Info size={20}/>
                About Us
            </NavLink>
            <NavLink 
                to={'/contact'} 
                className={({isActive}) => `flex items-center gap-2 text-[#E8EDE8]  transition-colors py-2 ${isActive ? 'bg-[#7C9A7E] text-white font-medium pl-2 rounded-md' 
                : 'text-[#E8EDE8] hover:bg-[#1A1E1B] hover:text-[#7C9A7E] pl-2 rounded-md'}`}
                onClick={() => setIsopen(false)}
            >
                <Contact size={20}/>
                Contact Us
            </NavLink>
            </nav>
    )
}

export default Navbar