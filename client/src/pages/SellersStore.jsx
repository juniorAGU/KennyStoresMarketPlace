import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSellersinfo } from '../Services/OrderServces';
import { useState, useEffect } from 'react';
import { ChevronLeft, Package, Star, Loader2 } from 'lucide-react';


function SellersStore() {

    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        getSellersinfo(sellerId)
        .then(({seller, products}) => {
            setSeller(seller)
            setProducts(products)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => setLoading(false))
    },[sellerId]);
    console.log(seller)


    if (loading) {
        return (
            <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 flex justify-center items-center'>
                <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
            </section>
        );
    }
    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-6xl mx-auto'>

                
                <Link to='/marketplace' className='flex items-center gap-2 text-[#E8EDE8] mb-8 hover:text-[#7C9A7E]'>
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back to Marketplace</span>
                </Link>

                {/* Seller Profile */}
                <article className='bg-[#252C26] rounded-xl p-6 md:p-8 mb-8'>
                    <article className='flex items-start gap-5'>
                        <img 
                            src={seller?.image || '/default-avatar.png'} 
                            alt={seller?.name}
                            className='w-20 h-20 rounded-full object-cover border-2 border-[#7C9A7E]'
                        />
                        <article>
                            <h1 className='text-white text-2xl font-bold'>{seller?.name}</h1>
                            <p className='text-[#E8EDE8]/60 text-sm mt-1'>{seller?.bio || 'No bio yet'}</p>
                            <article className='flex items-center gap-5 mt-4'>
                                <article className='text-center'>
                                    <p className='text-white font-bold'>{seller?.totalProduct || 0}</p>
                                    <p className='text-[#E8EDE8]/50 text-xs'>Products</p>
                                </article>
                                <article className='text-center'>
                                    <p className='text-white font-bold'>{seller?.totalSold || 0}</p>
                                    <p className='text-[#E8EDE8]/50 text-xs'>Sales</p>
                                </article>
                                <article className='text-center'>
                                    <p className='text-white font-bold text-xs'>
                                        {new Date(seller?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className='text-[#E8EDE8]/50 text-xs'>Member since</p>
                                </article>
                            </article>
                        </article>
                    </article>
                </article>

                {/* Products Grid */}
                <h2 className='text-white text-lg font-semibold mb-4'>Products by {seller?.name}</h2>
                
                {products.length === 0 ? (
                    <article className='text-center py-20'>
                        <Package size={48} className='text-[#E8EDE8]/20 mx-auto mb-4' />
                        <p className='text-[#E8EDE8]/50'>No products yet</p>
                    </article>
                ) : (
                    <article className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {products.map(product => (
                            <Link to={`/marketplace/${product._id}`} key={product._id}>
                                <article className='bg-[#252C26] rounded-xl overflow-hidden hover:border-[#7C9A7E] border border-[#252C26] transition-colors'>
                                    <img 
                                        src={product.images?.[0]} 
                                        alt={product.name}
                                        className='w-full aspect-square object-cover'
                                    />
                                    <article className='p-3'>
                                        <p className='text-white text-sm font-medium truncate'>{product.name}</p>
                                        <p className='text-[#7C9A7E] font-bold mt-1'>₦{Number(product.price).toLocaleString()}</p>
                                    </article>
                                </article>
                            </Link>
                        ))}
                    </article>
                )}

            </article>
        </section>
    )
}

export default SellersStore