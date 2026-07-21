import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UseAuth from '../Hooks/UseAuth';
import { Eye, EyeOff,Loader2,Camera, ChevronLeft } from "lucide-react";
import UseMessage from '../Hooks/UseMessage';
import { Allbanks } from '../Services/PayoutService';

function EditProfile() {

    const { user, EditUser,fetchUser } = UseAuth();

    const navigate = useNavigate();
    const [bank, setBank] = useState([]);
    const [bankloading, setBankloading] = useState(true)

    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        phone: user?.phone || '',
        title: user?.title || "",
        email: user?.email,
        accountNumber: user?.accountNumber || "",
        accountName: user?.accountName || "",
        bankcode: user?.bankCode || "",
        loading: false
    });

    const [preview, setPreview] = useState(null);
    const [avarta, setAvata] = useState(user?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQloFBXdJpz-BwRdlA2tRGZabgoHaMMy3DAyRilDT0FRgQ7YymDiws_mQl0bv4LBMWjSnmMZErUS_Efaqug6UobclXP3pvUgkiliBV7PH9v&s=10');
    // const [ messages, setMessages] = useState(null);
    const {messages,Showmessage,typColo} = UseMessage();

    useEffect(() => {
        Allbanks()
        .then(({banks}) => {
            setBank(banks)
        })
        .catch(err => {
            Showmessage('failed', err?.response?.data?.message || "unable to fetch Banks")
        })
        .finally(() => setBankloading(false))
    },[]);

    

    const handleChange = (e) => {

        const{ name,value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleImage = (e) => {

        const file = e.target.files[0];

        if(file){
            setAvata(file);
            setPreview(URL.createObjectURL(file));
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if( formData.bio === "" || formData.location === ""  || formData.name === ""  || formData.phone === "" || formData.title === ""){
            Showmessage("failed", "inputs must not be Empty!!");
            return;
        };

        setFormData({...formData,loading: true});
        try{

            const newData ={
                name: formData.name,
                email: user.email,
                bio: formData.bio,
                title: formData.title,
                phone: formData.phone,
                location: formData.location,
                accountName: formData.accountName,
                accountNumber: formData.accountNumber,
                bankcode: formData.bankcode,
                image: avarta
            };

            const success = EditUser(newData);

            if(success){
                await fetchUser();
                
                setFormData({
                    name: user?.name || '',
                    bio: user?.bio || '',
                    location: user?.location || '',
                    phone: user?.phone || '',
                    title: user?.title || "",
                    email: user?.email,
                    accountNumber: user?.accountNumber || "",
                    accountName: user?.accountName || "",
                    bankcode: user?.bankCode || "",
                });
                navigate("/")
            }
        }catch(err){
            console.log(err);
            throw err
        }finally{
            setFormData({...formData,loading: false})
        }
    }

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-[600px] mx-auto'>

                
                <button 
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-[#E8EDE8] mb-8 hover:text-[#7C9A7E] transition-colors'
                >
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back</span>
                </button>

                <h1 className='text-white text-2xl font-bold mb-8'>Edit Profile</h1>

                <form  className='space-y-6' onSubmit={handleSubmit}>
                    
                    {/* Avatar */}
                    <article className='flex flex-col items-center'>
                        <article className='relative mb-4'>
                            <img 
                                src={preview || user?.image} 
                                alt="Profile"
                                className='w-24 h-24 rounded-full object-cover border-2 border-[#7C9A7E]'
                            />
                            <label className='absolute bottom-0 right-0 w-8 h-8 bg-[#7C9A7E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#5E7D61] transition-colors'>
                                <Camera size={14} className='text-white' />
                                <input 
                                    type="file" 
                                    accept='image/*'
                                    onChange={handleImage}
                                    className='hidden'
                                />
                            </label>
                        </article>
                        <p className='text-[#E8EDE8]/50 text-xs'>Click to change photo</p>
                    </article>

                    
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Name</label>
                        <input 
                            type="text"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </article>

                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Title</label>
                        <input 
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            placeholder="e.g. Fashion Designer, Tech Enthusiast"
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </article>

                    
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Email</label>
                        <input 
                            type="email"
                            name='email'
                            value={user?.email || ''}
                            disabled
                            className='w-full px-4 py-3 bg-[#1A1E1B] border border-[#252C26] rounded-lg text-[#E8EDE8]/50 cursor-not-allowed'
                        />
                    </article>

                    {/* Bio */}
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Bio</label>
                        <textarea 
                            name='bio'
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Tell people about yourself..."
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition resize-none'
                        />
                    </article>

                
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Location</label>
                        <input 
                            type="text"
                            name='location'
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </article>

                    
                    <article>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Phone Number</label>
                        <input 
                            type="tel"
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+234..."
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </article>


                    {
                        user?.accountType === 'seller' && (
                            <article className='border-t border-[#252C26] pt-6'>
                                <h2 className='text-white text-lg font-semibold mb-4'>Bank Details (For Payouts)</h2>
                                
                                <article>
                                    <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Account Name</label>
                                    <input 
                                        name='accountName'
                                        value={formData.accountName}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                                    />
                                </article>
                                
                                <article>
                                    <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Bank Name / Code</label>
                                    <select 
                                        onChange={handleChange}
                                        name='bankcode'
                                        className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                                    >
                                        <option value=''>{bankloading ? " Loading Banks" :'Select Bank'}</option>
                                        {
                                            bank?.map(banks => (
                                                <option key={banks.code} value={banks.code}>{banks.name}</option>
                                            ))
                                        }
                                    </select>
                                </article>
                                
                                <article>
                                    <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>Account Number</label>
                                    <input 
                                        name='accountNumber' 
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        type='number'
                                        min={0}
                                        className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                                    />
                                </article>
                            </article>
                        )
                    }

                    
                    
                    <button 
                        type="submit"
                        disabled={formData.loading}
                        className={`w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed duration-200 tracking-wide flex items-center justify-center ${
                            formData.loading 
                                ? 'bg-[#5E7D61] cursor-not-allowed' 
                                : 'bg-[#7C9A7E] hover:bg-[#5E7D64] focus:ring-[#7C9A7E]'}`}
                    >
                        {formData.loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : 'Save Changes'}
                    </button>

                </form>


            </article>
            {
                messages && (
                    <div className={`slider fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]} `}>
                        <h1>

                            {messages.message}

                        </h1>
                    </div>
                )
            }
        </section>
    );

}

export default EditProfile