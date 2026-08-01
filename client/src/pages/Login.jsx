import { useState,useEffect } from 'react';
import Logo from '../Components/Logo';
import { Link } from 'react-router-dom';
import bgImage from '../assets/pawel-czerwinski-pC8e7FFONcI-unsplash.jpg';
import UseAuth from '../Hooks/UseAuth';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UseMessage from '../Hooks/UseMessage';

function Login() {

    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
        loading: false
    });
    const {login, fetchUser} = UseAuth();
    const {messages, typColo, Showmessage} = UseMessage();



    const handleChange = (e) => {

        const {name,value} = e.target;

        setData({
            ...data,
            [name]:value
        })
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(data.email === "" || data.password === ""){

            Showmessage("failed", "input must not be Empty!!!");

            return;
        };
        
        if(data.password.length < 8){

            Showmessage("failed", "password must be greater than 9 characteres!!!");

            return;
        };

        if(!/[A-Z]/.test(data.password)){

            Showmessage("warning", "inputs must contain one Alphabet!!!");

            return;
        };

        setData({...data, loading: true});
        
        try{

            const newData = {
                email: data.email,
                password: data.password
            };

            const success = await login(newData);

            if(success){
                setData({
                    email: "",
                    password: "",
                });
                // fetchUser();
                navigate('/marketplace')
            }
        }catch(err){
            console.log(err)
            throw err
        }finally{
            setData({...data,loading: false});
        };

        
    };

    return (
        <section className="relative bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-10 min-h-screen"
            style={{backgroundImage: `url(${bgImage})`}}
        >
            <article className="w-full max-w-md">
                <header className='mb-8'>
                    <span className="text-xs tracking-widest uppercase font-semibold">
                        <Logo />
                    </span>
                    <h1 className="text-2xl font-bold text-white mt-2 leading-snug">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-[#E8EDE8] mt-1">
                        Don't have an account?{" "}
                        <Link to={'/register'} className="text-[#7C9A7E] hover:text-white hover:underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </header>
                <form className='space-y-5' onSubmit={handleSubmit}>
    
                    <div>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>
                            Email
                        </label>
                        <input 
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            type="email" 
                            placeholder="Enter your email"
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </div>

                    
                    <div>
                        <label className='block text-sm font-medium text-[#E8EDE8] mb-2'>
                            Password
                        </label>
                        <input 
                            name='password'
                            value={data.password}
                            onChange={handleChange}
                            type="password" 
                            placeholder="Enter your password"
                            className='w-full px-4 py-3 bg-[#252C26] border border-[#7C9A7E] rounded-lg text-white placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:border-transparent transition'
                        />
                    </div>

                
                    <div className='text-right'>
                        <Link to={'/forgot-password'} className='text-sm text-[#7C9A7E] hover:text-white hover:underline'>
                            Forgot password?
                        </Link>
                    </div>

                    
                    <button 
                        disabled={data.loading}
                        type="submit"
                        className={`w-full py-3 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C9A7E] focus:ring-offset-2 focus:ring-offset-[#1A1E1B] duration-200 tracking-wide flex items-center justify-center ${
                            data.loading 
                                ? 'bg-[#5E7D61] cursor-not-allowed' 
                                : 'bg-[#7C9A7E] hover:bg-[#5E7D64] focus:ring-[#7C9A7E]'}`}
                    >
                        { data.loading ? (<Loader2 className="h-5 w-5 animate-spin text-white" />) : "Sign In"}
                    </button>
                </form>
            </article>

            {
                messages && (
                    <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded ${typColo[messages.type]} `}>
                        <h1>

                            {messages.message}

                        </h1>
                    </div>
                )
            }

        </section>
    )
}

export default Login