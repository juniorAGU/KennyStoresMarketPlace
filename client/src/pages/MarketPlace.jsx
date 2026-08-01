
import { useEffect,useState, } from 'react';
import { useSearchParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Heart, MessageCircle,Loader2 } from 'lucide-react';
import { motion } from "framer-motion"
import { data, Link } from 'react-router-dom';
import UseProducts from '../Hooks/UseProducts';
import  UseAuth from '../Hooks/UseAuth'
import UseComments from '../Hooks/UseComments';
import UseMessage from '../Hooks/UseMessage';
import { getLikes1,createLikes1,getComments } from '../Services/CommentService';
import UseCart from '../Hooks/UseCart';


const MarketPlace = () => {
    const [seachParams, setSearchParams] = useSearchParams();

    const { FetchProducts, products, loading } = UseProducts();
    const { user } = UseAuth();
    const { PostComment, GetComments,} = UseComments();
    const { Showmessage,typColo,messages} = UseMessage();
    const { AddToCart, FetchCart, cart,} = UseCart();
    

    

    const [commentid,setCommentid] = useState(null);
    const [allcomments, setAllcomments] = useState({});
    const [commentdata, setCommentdata] = useState({text: "", loading: false});
    const [recentcommentid, setRecentcommentid] = useState(null);
    const [commentCounts, setCommentCounts] = useState({});
    const [addingToCart, setAddingToCart] = useState({});

    
    useEffect(() => {
        FetchCart();
    },[]);

    useEffect(() => {
        AOS.init({ duration: 800, once: false });
    }, []);

    useEffect(()=> {
        FetchProducts();
    },[commentid])

    useEffect(() => {
        if(recentcommentid){
            GetComments(recentcommentid)
            .then((comments) => { setAllcomments(prev => ({
                ...prev,
                [recentcommentid]: comments
            }))})
        }
    },[recentcommentid]);
    useEffect(() => {
    if (products.length > 0) {
        products.forEach(async (product) => {
            const { comments } = await getComments(product._id);
            setCommentCounts(prev => ({ 
                ...prev, 
                [product._id]: comments.length   // just the length
            }));
        });
    }
}, [products]);

    const handlechange = (e) => {
        const {name,value} = e.target;
        setCommentdata({
            ...commentdata,
            [name]:value
        })
    };

    const handleSubmit = async(e,productId) => {
        e.preventDefault();

        if(commentdata.text === ""){
            Showmessage("failed", "comments must not be empty");
            return
        };
        setCommentdata({...commentdata, loading: true});
        try{


            const success = await PostComment( productId, commentdata.text);

            if(success){
                setCommentdata({
                    text: "", loading: false
                })
                const update = await GetComments(productId);
                setAllcomments(prev => ({
                    ...prev,
                    [productId]: update
                }))
            }
        }catch(err){
            console.log(err);
            setCommentdata({...commentdata, loading: false});
            throw err
        }

    }

    const [likeProduct, setLikeProduct] = useState({});
    const [likeCount, setLikeCount] = useState({});

    useEffect(() => {
    if (products && products.length > 0) {
        products.forEach(async (product) => {
            const { count } = await getLikes1(product._id);  
            setLikeCount(prev => ({ ...prev, [product._id]: count }));
        });
    }
}, [products]);

    const handleLikes = async (productId) => {
        
        const { islike, count } = await createLikes1(productId);
        setLikeProduct(prev => ({...prev, [productId]: islike}));
        setLikeCount(prev => ({...prev, [productId]: count}))
    }


    const Allfilter = seachParams.get("category") || "";
    useEffect(() => {
    FetchProducts(Allfilter);
}, [Allfilter]);
    const filters = ['All Products', 'Electronics', 'fashion', 'Furniture'];
    const handleFilter = (filters) => {
        if(filters === "All Products"){
            setSearchParams({});
        }else{
            setSearchParams({category: filters.toLowerCase()})
        }
    }

    const FilterProducts = !Allfilter ? products : products.filter(p => p.category === Allfilter);

    const GetQuantityforcart = (productId) => {
        const item = cart?.items?.find(pro => ( pro.product?._id || pro.product) === productId);
        return item?.quantity || 0
    }


    return (
        <section className='bg-[#1A1E1B] py-16 md:py-24 px-4'>
            <article className='max-w-2xl mx-auto'>
                
                
                <article className='flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide'>
                    {filters.map((filter, index) => (
                        <button 
                            onClick={() => handleFilter(filter)}
                            key={index}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                                Allfilter === filter || (filter === 'All Products' && !seachParams.get('category'))
                                    ? 'bg-[#7C9A7E] text-white' 
                                    : 'bg-[#252C26] text-[#E8EDE8] hover:bg-[#7C9A7E] hover:text-white'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </article>

                {/* Product Cards — Instagram style */}
                <article className='space-y-8'>
                    {FilterProducts.map((product, index) => {
                        
                        const cartQuantity = GetQuantityforcart(product._id);
                        const isMax = cartQuantity >= product.quantity;
                        const outOfStock = product.quantity === 0;

                        return (
                        <motion.article 
                            
                            whileHover={{scale: 1.01,}}
                            key={product._id}
                            className='bg-[#252C26] rounded-xl overflow-hidden'
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            {/* Seller Info */}
                            <article className='flex items-center gap-3 p-4'>
                                <img 
                                    src={product.seller.image} 
                                    alt={product.seller.name}
                                    className='w-10 h-10 rounded-full object-cover'
                                />
                                <span className='text-white font-semibold text-sm'>{product.seller.name}</span>
                            </article>

                            {/* Product Image */}
                            <article className='w-full aspect-square overflow-hidden'>
                                <Link to={`/marketplace/${product._id}`}>
                                    <img 
                                        src={product.images[1]} 
                                        alt={product.name}
                                        className='w-full h-full object-cover'
                                    />
                                </Link>
                                
                            </article>

                            {/* Actions */}
                            <article className='p-4'>
                                {/* Like & Comment */}
                                <article className='flex items-center gap-5 mb-3'>
                                    <button
                                        onClick={() => handleLikes(product._id)}
                                        className='flex items-center gap-1.5 text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'>
                                        <Heart size={22} 
                                            fill={likeProduct[product._id] ? '#7C9A7E' : "none"}
                                            className={likeProduct[product._id] ? 'text-[#7C9A7E]' : 'text-[#E8EDE8]'}
                                        />
                                        <span className='text-sm'>{likeCount[product._id] || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => {setCommentid(commentid === product._id ? null : product._id)
                                                        setRecentcommentid(product._id)
                                        }}
                                        className='flex items-center gap-1.5 text-[#E8EDE8] hover:text-[#7C9A7E] transition-colors'>
                                        <MessageCircle size={22} />
                                        <span className='text-sm'>{allcomments[product._id] ? allcomments[product._id].length : commentCounts[product._id] || 0  }</span>
                                    </button>
                                </article>

                                {commentid === product._id && (
                                    <>
                                        {/* Comment Form */}
                                        <form onSubmit={(e) => handleSubmit(e, product._id)} className='mt-3 flex items-center gap-2'>
                                            <input 
                                                type="text"
                                                name='text'
                                                value={commentdata.text}
                                                onChange={handlechange}
                                                placeholder="Add a comment..."
                                                className='flex-1 px-3 py-2 bg-[#1A1E1B] border border-[#7C9A7E] rounded-lg text-white text-sm placeholder-[#E8EDE8]/50 focus:outline-none focus:ring-1 focus:ring-[#7C9A7E]'
                                            />
                                            <button
                                                disabled={commentdata.loading} 
                                                className='px-4 py-2 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors'
                                            >
                                                {commentdata.loading ? <Loader2 className='animate-spin' size={16} /> : "Post"}
                                            </button>
                                        </form>

                                        <article className='mt-4 space-y-3  max-h-[80px] overflow-y-auto comment-scroll'>
                                                {(allcomments[product._id] || []).map((comment) => (
                                                    <article key={comment._id} className='flex gap-3  '>
                                                        <img 
                                                            src={comment.user?.image} 
                                                            alt={comment.user?.name}
                                                            className='w-8 h-8 rounded-full object-cover flex-shrink-0'
                                                        />
                                                        <article>
                                                            <article className='flex items-center gap-2'>
                                                                <span className='text-white text-sm font-semibold'>{comment.user?.name}</span>
                                                                <span className='text-[#E8EDE8]/40 text-xs'>
                                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </article>
                                                            <p className='text-[#E8EDE8]/70 text-sm mt-0.5'>{comment.text}</p>
                                                        </article>
                                                    </article>
                                                ))}
                                        </article>
                                    </>
                                )}

                                {/* Product Name */}
                                <h3 className='text-white font-semibold text-sm'>{product.name}</h3>
                                <p className='text-[#7C9A7E] font-bold text-lg mt-1'>₦{Number(product.price).toLocaleString()}</p>
                            </article>

                            {/* Add to Cart Button */}
                            {user?.accountType === "buyer" 
                            ? <article className='px-4 pb-4'>
                                <motion.button
                                    onClick={async () => {
                                        setAddingToCart(prev => ({ ...prev, [product._id]: true }));
                                        await AddToCart(product._id, 1);
                                        setAddingToCart(prev => ({ ...prev, [product._id]: false }));
                                    }}
                                    disabled={isMax}
                                    whileHover={!isMax && !outOfStock ? {scale: 1.02} : {}}
                                    whileTap={!isMax && !outOfStock ? {scale: 1.90} : {}}
                                    className={`w-full py-3 font-semibold rounded-lg transition-colors flex justify-center items-center ${outOfStock ? 'bg-[#252C26] text-[#E8EDE8]/30 cursor-not-allowed' : isMax 
                                                ? 'bg-[#252C26] text-[#7C9A7E] cursor-not-allowed' 
                                                : 'bg-[#7C9A7E] text-white hover:bg-[#5E7D61]'
                                    }`}
                                    >
                                        {
                                            outOfStock ? "Out Of Stock" : addingToCart[product._id] ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : isMax ? "maximum in cart" : "Add to Cart"
                                        }
                                </motion.button>
                            </article> 
                            :
                            ""}
                            
                        </motion.article>
                        )
                    })}
                </article>

            </article>
        </section>
    );
};

export default MarketPlace;