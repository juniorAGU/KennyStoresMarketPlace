// components/HowItWorks.jsx
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { UserPlus, Store, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: false });
    }, []);

    const steps = [
        {
            icon: UserPlus,
            title: 'Create an Account',
            desc: 'Sign up in seconds. No hidden fees, no credit card required.',
        },
        {
            icon: Store,
            title: 'List or Browse Products',
            desc: 'Sellers list items with ease. Buyers browse thousands of products.',
        },
        {
            icon: ShoppingBag,
            title: 'Buy or Sell with Confidence',
            desc: 'Secure payments, verified sellers, and buyer protection guaranteed.',
        },
    ];

    return (
        <section className='bg-[#1A1E1B] py-12 md:py-20 px-4'>
            <article className='max-w-7xl mx-auto'>
                
                {/* Heading */}
                <h2 
                    className='text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-16'
                    data-aos="fade-up"
                >
                    How It Works
                </h2>

                {/* Steps */}
                <article className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {steps.map((step, index) => (
                        <article
                            key={index}
                            className='bg-[#252C26] rounded-xl p-6 md:p-8 text-center border border-[#252C26] hover:border-[#7C9A7E] transition-all duration-300'
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                        >
                            {/* Icon */}
                            <article className='w-14 h-14 md:w-16 md:h-16 bg-[#1A1E1B] rounded-full flex items-center justify-center mx-auto mb-5'>
                                <step.icon size={28} className='text-[#7C9A7E]' />
                            </article>

                            {/* Step number */}
                            <span className='text-[#7C9A7E] text-sm font-semibold tracking-widest uppercase'>
                                Step {index + 1}
                            </span>

                            {/* Title */}
                            <h3 className='text-white text-lg md:text-xl font-bold mt-2 mb-3'>
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className='text-[#E8EDE8]/70 text-sm md:text-base'>
                                {step.desc}
                            </p>
                        </article>
                    ))}
                </article>

                {/* CTA */}
                <article className='text-center mt-10 md:mt-14' data-aos="fade-up">
                    <motion.article
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='inline-block'
                    >
                        <Link 
                            to={'/marketplace'} 
                            className='inline-block px-8 py-4 bg-[#7C9A7E] text-white font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors text-lg'
                        >
                            Start Selling Today
                        </Link>
                    </motion.article>
                </article>

            </article>
        </section>
    );
};

export default HowItWorks;