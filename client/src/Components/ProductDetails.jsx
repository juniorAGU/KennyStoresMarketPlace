// Components/ProductDetails.jsx
import { useState,useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, ChevronLeft, Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import UseProducts from '../Hooks/UseProducts';
import {Loader2} from 'lucide-react';
import UseCart from '../Hooks/UseCart';
import UseAuth from '../Hooks/UseAuth';
import { motion } from 'framer-motion';
import UseMessage from '../Hooks/UseMessage';

function ProductDetails() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const { SpecificProduct, loading } = UseProducts();
    const { AddToCart, FetchCart, cart,} = UseCart();
    const { user } = UseAuth();
    const [addingTocart, setAddingTocart] = useState({});
    const {messages,typColo,Showmessage} = UseMessage();

    useEffect(()=>{
        SpecificProduct(id)
        .then(({products}) => (setProduct(products)) )
    },[id]);

    useEffect(() => {
        FetchCart();
    },[])

    console.log(product)

    if (!product) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B]  flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' />
            </section>
        );
    }
    const handleCart = async (productId) => {
        try{

            setAddingTocart(prev => ({...prev, [productId]: true}))
            await AddToCart(productId,quantity)
            setAddingTocart(prev => ({...prev, [productId]: false}))

        }catch(err){
            setAddingTocart(prev => ({ ...prev, [productId]: false }));
            console.log(err)
            Showmessage("failed", err.response.data.message || "unable to Add items any more")
        }
        
    }

    const cartItem = cart?.items?.find(pro => (pro.product?._id || pro.product) === product._id);
    const cartQuantity = cartItem?.quantity || 0
    const isMax = cartQuantity >= product.quantity;
    const outOfStock = product.quantity === 0;

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            
            <article className='max-w-[700px] mx-auto'>
                
                {/* Back Button */}
                <Link to={'/marketplace'} className='inline-flex items-center gap-2 text-[#E8EDE8] mb-6 hover:text-[#7C9A7E] transition-colors'>
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back to Marketplace</span>
                </Link>

                {/* Product Image - Rectangle */}
                <article className='w-full aspect-video rounded-xl overflow-hidden mb-6'>
                    <img 
                        src={product.images[1]} 
                        alt={product.name}
                        className='w-full h-full object-cover'
                    />
                </article>

                {/* Seller & Product Info - Side by side */}
                <article className='flex items-center justify-between mb-6'>
                    <Link to={`/seller/${product.seller?._id}`}>
                    <article className='flex items-center gap-3'>
                        <img 
                            src={product.seller.image} 
                            alt={product.seller.name}
                            className='w-10 h-10 rounded-full object-cover'
                        />
                        <article>
                            <p className='text-white font-semibold text-sm'>{product.seller.name}</p>
                            <p className='text-[#E8EDE8]/50 text-xs'>{product.sold} sold</p>
                        </article>
                    </article>
                    </Link>

                    <article className='flex items-center gap-1 text-yellow-400'>
                        <Star size={16} fill='currentColor' />
                        <span className='text-white text-sm font-semibold'>{product.rating}</span>
                        <span className='text-[#E8EDE8]/50 text-sm'>({product.reviews})</span>
                    </article>
                </article>

                {/* Name & Price */}
                <article className='mb-6'>
                    <h1 className='text-white text-2xl font-bold mb-1'>{product.name}</h1>
                    <p className='text-[#7C9A7E] text-3xl font-bold'>₦{Number(product.price).toLocaleString()}</p>
                </article>

                {/* Details Grid - Side by side */}
                <article className='grid grid-cols-2 gap-3 mb-6'>
                    <article className='bg-[#252C26] rounded-lg p-4'>
                        <p className='text-[#E8EDE8]/50 text-xs uppercase tracking-wider mb-1'>Category</p>
                        <p className='text-white text-sm font-medium'>{product.category}</p>
                    </article>
                    <article className='bg-[#252C26] rounded-lg p-4'>
                        <p className='text-[#E8EDE8]/50 text-xs uppercase tracking-wider mb-1'>Condition</p>
                        <p className='text-white text-sm font-medium'>{product.condition}</p>
                    </article>
                </article>

                {/* Description - Full width */}
                <article className='mb-6'>
                    <h3 className='text-white font-semibold text-sm mb-2'>Description</h3>
                    <p className='text-[#E8EDE8]/70 text-sm leading-relaxed'>{product.description}</p>
                </article>

                {/* Shipping & Policies - Side by side */}
                <article className='grid grid-cols-3 gap-3 mb-6'>
                    <article className='bg-[#252C26] rounded-lg p-3 text-center'>
                        <Truck size={20} className='text-[#7C9A7E] mx-auto mb-1' />
                        <p className='text-[#E8EDE8] text-xs'>₦{Number(product.shippingFee).toLocaleString()}</p>
                    </article>
                    <article className='bg-[#252C26] rounded-lg p-3 text-center'>
                        <ShieldCheck size={20} className='text-[#7C9A7E] mx-auto mb-1' />
                        <p className='text-[#E8EDE8] text-xs'>1 year waranty</p>
                    </article>
                    <article className='bg-[#252C26] rounded-lg p-3 text-center'>
                        <RotateCcw size={20} className='text-[#7C9A7E] mx-auto mb-1' />
                        <p className='text-[#E8EDE8] text-xs'>No return after 30 days</p>
                    </article>
                </article>

                {/* Quantity */}
                <article className='flex items-center justify-between mb-6'>
                    <span className='text-white text-sm font-medium'>Quantity</span>
                    <article className='flex items-center gap-3'>
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className='w-8 h-8 bg-[#252C26] text-white rounded-lg flex items-center justify-center hover:bg-[#7C9A7E] transition-colors'
                        >
                            -
                        </button>
                        <span className='text-white text-sm w-6 text-center'>{quantity}</span>
                        <button 
                            onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                            disabled={quantity >= product.quantity  }
                            className='w-8 h-8 bg-[#252C26] text-white rounded-lg flex items-center justify-center hover:bg-[#7C9A7E] transition-colors'
                        >
                            +
                        </button>
                    </article>
                </article>

                {/* Like & Comment */}
                <article className='flex items-center gap-5 mb-6'>
                    <button className='flex items-center gap-1.5 text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'>
                        <Heart size={22} />
                        <span className='text-sm'>product reviews</span>
                    </button>
                    <button className='flex items-center gap-1.5 text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'>
                        <MessageCircle size={22} />
                        <span className='text-sm'>18</span>
                    </button>
                </article>

                {/* Add to Cart - Full width at bottom */}
                {
                    user?.accountType === "buyer" 
                    ? <motion.button 
                        onClick={() => handleCart(product?._id)}
                        disabled={isMax}
                        whileHover={!isMax && !outOfStock ? {scale: 1.02}: {}}
                        whileTap={!isMax && !outOfStock ? {scale: 1.90} : {}}
                        className={`w-full py-3 font-semibold rounded-lg transition-colors flex justify-center items-center ${outOfStock ? 'bg-[#252C26] text-[#E8EDE8]/30 cursor-not-allowed' : isMax 
                                                ? 'bg-[#252C26] text-[#7C9A7E] cursor-not-allowed' 
                                                : 'bg-[#7C9A7E] text-white hover:bg-[#5E7D61]'
                                    }`}
                        >
                            {
                                outOfStock ? "Out Of Stock" : addingTocart[product._id] ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : isMax ? "maximum in cart" : `Add to Cart - ₦${Number(product.price).toLocaleString()}`
                            }
                        </motion.button>
                    : ""
                }
                

            </article>
            {
                messages && (
                    <div className={`slider fixed top-4 right-4 text-white px-4 py-2 rounded z-50 ${typColo[messages.type]} `}>
                        <h1>
                            {messages.message}
                        </h1>
                    </div>
                )
            }
        </section>
    );
}

export default ProductDetails;


