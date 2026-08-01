
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import UseAuth from '../Hooks/UseAuth';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';

const UserDropdown = ({ user }) => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const { logout } = UseAuth();

    const dropdownRef = useRef(null);

    
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {

                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, []);

    const handlelogout = async () => {

        await logout();

        setIsOpen(false);

    

    }

    return (
        <article className='relative' ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2'
            >
                <img 
                    src={user.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQloFBXdJpz-BwRdlA2tRGZabgoHaMMy3DAyRilDT0FRgQ7YymDiws_mQl0bv4LBMWjSnmMZErUS_Efaqug6UobclXP3pvUgkiliBV7PH9v&s=10'} 
                    alt={user.name}
                    className='w-8 h-8 rounded-full object-cover border-2 border-[#7C9A7E]'
                />
                <span className='text-[#E8EDE8] text-sm hidden md:block'>
                    {user.name}
                </span>
            </button>

            {isOpen && (
                <article className='absolute right-0 top-12 w-48 bg-[#252C26] border border-[#1A1E1B] rounded-lg shadow-xl py-2'>
                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            setIsProfileOpen(true);
                        }}
                        className='flex items-center gap-3 px-4 py-2 text-[#E8EDE8] text-sm hover:bg-[#1A1E1B] transition-colors w-full'
                    >
                        <Settings size={16} />
                        Profile Settings
                    </button>
                    <button 
                        onClick={handlelogout}
                        className='flex items-center gap-3 px-4 py-2 text-[#E8EDE8] text-sm hover:bg-[#1A1E1B] transition-colors w-full'
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                    <Link 
                        to={'setting'}
                        className='flex items-center gap-3 px-4 py-2 text-[#E8EDE8] text-sm hover:bg-[#1A1E1B] transition-colors w-full'
                    >
                        <Settings size={16} />
                        Settings
                    </Link>
                </article>
            )}

            
                <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            
        </article>
    );
};

export default UserDropdown;