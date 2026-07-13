// pages/MyProducts.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Eye, Package, Loader2 } from 'lucide-react';
import UseProducts from '../Hooks/UseProducts';
import UseMessage from '../Hooks/UseMessage';

const MyProducts = () => {
    const {  myProducts,FetchMyProducts, loading, page,LoadMore,totalpage,hasmore,DeletemyProduct } = UseProducts();
    const { Showmessage, typColo, messages } = UseMessage();
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        FetchMyProducts();
    }, []);

    const handleDelete = async (id) => {
        await DeletemyProduct(id);
        Showmessage("success", "Product deleted");
        setDeleteId(null);
        FetchMyProducts();
    };

    const stats = [
        { label: 'Total Products', value: myProducts?.length || 0 },
        { label: 'Available', value: myProducts?.filter(p => p.status === 'available').length || 0 },
        { label: 'Sold', value: myProducts?.filter(p => p.status === 'sold').length || 0 },
        {label: "sold out", value: myProducts?.filter(p => p?.quantity === 0).length || 0 }
    ];

    return (
        <section className='w-full min-h-screen bg-[#1A1E1B] pt-20 px-4 pb-12'>
            <article className='max-w-6xl mx-auto'>

                {/* Back */}
                <Link 
                    to='/dashboard'
                    className='flex items-center gap-2 text-[#E8EDE8] mb-6 hover:text-[#7C9A7E] transition-colors'
                >
                    <ChevronLeft size={20} />
                    <span className='text-sm'>Back to Dashboard</span>
                </Link>

                
                <article className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
                    <article>
                        <h1 className='text-white text-2xl font-bold'>My Products</h1>
                        <p className='text-[#E8EDE8]/50 text-sm mt-1'>Manage your listings</p>
                    </article>
                    <Link 
                        to='/addproduct'
                        className='px-5 py-2.5 bg-[#7C9A7E] text-white text-sm font-semibold rounded-lg hover:bg-[#5E7D61] transition-colors text-center'
                    >
                        + Add Product
                    </Link>
                </article>

                
                <article className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    {stats.map((stat, index) => (
                        <article key={index} className='bg-[#252C26] rounded-xl p-4 text-center'>
                            <p className='text-white text-xl md:text-2xl font-bold'>{stat.value}</p>
                            <p className='text-[#E8EDE8]/50 text-xs mt-1'>{stat.label}</p>
                        </article>
                    ))}
                </article>

                
                {loading ? (
                    <article className='flex justify-center py-20'>
                        <Loader2 className='animate-spin text-[#7C9A7E]' size={32} />
                    </article>
                ) : !myProducts || myProducts.length === 0 ? (
                    <article className='text-center py-20'>
                        <Package size={48} className='text-[#E8EDE8]/30 mx-auto mb-4' />
                        <p className='text-[#E8EDE8]/50'>No products yet</p>
                        <Link 
                            to='/dashboard/add-product'
                            className='text-[#7C9A7E] text-sm hover:underline mt-2 inline-block'
                        >
                            Add your first product
                        </Link>
                    </article>
                ) : (
                    <article className='space-y-3'>
                        {/* Table Header */}
                        <article className='hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-[#E8EDE8]/50 text-xs uppercase tracking-wider'>
                            <p className='col-span-5'>Product</p>
                            <p className='col-span-2'>Price</p>
                            <p className='col-span-1'>Stock</p>
                            <p className='col-span-2'>Status</p>
                            <p className='col-span-2'>Actions</p>
                        </article>

                        {/* Product Rows */}
                        {myProducts.map((product) => (
                            <article key={product._id} className='bg-[#252C26] rounded-xl p-4'>
                                <article className='md:grid md:grid-cols-12 gap-4 items-center'>
                                    
                                    {/* Product Info */}
                                    <article className='col-span-5 flex items-center gap-3 mb-3 md:mb-0'>
                                        <img 
                                            src={product.images?.[0]} 
                                            alt={product.name}
                                            className='w-12 h-12 rounded-lg object-cover flex-shrink-0'
                                        />
                                        <article className='min-w-0'>
                                            <p className='text-white text-sm font-semibold truncate'>{product.name}</p>
                                            <p className='text-[#E8EDE8]/40 text-xs'>{product.category}</p>
                                        </article>
                                    </article>

                                    {/* Price */}
                                    <article className='col-span-2 mb-2 md:mb-0'>
                                        <p className='text-[#7C9A7E] text-sm font-semibold md:text-left'>
                                            ₦{Number(product.price).toLocaleString()}
                                        </p>
                                    </article>

                                    {/* Stock */}
                                    <article className='col-span-1 mb-2 md:mb-0'>
                                        <p className='text-[#E8EDE8] text-sm'>{product.quantity}</p>
                                    </article>

                                    {/* Status */}
                                    <article className='col-span-2 mb-3 md:mb-0'>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            product?.quantity === 0
                                            ? "bg-red-500/20 text-red-400"
                                            : product.status === 'available' 
                                                ? 'bg-green-500/20 text-green-400'
                                                : product.status === 'sold'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {product?.quantity === 0 ? "Sold Out" : product.status}
                                        </span>
                                    </article>

                                    {/* Actions */}
                                    <article className='col-span-2 flex items-center gap-2'>
                                        <Link 
                                            to={`/marketplace/${product._id}`}
                                            className='p-2 bg-[#1A1E1B] text-[#E8EDE8] rounded-lg hover:text-[#7C9A7E] transition-colors'
                                            title='View'
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link 
                                            to={`/editeproducts/${product._id}`}
                                            className='p-2 bg-[#1A1E1B] text-[#E8EDE8] rounded-lg hover:text-[#7C9A7E] transition-colors'
                                            title='Edit'
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button 
                                            onClick={() => setDeleteId(product._id)}
                                            className='p-2 bg-[#1A1E1B] text-[#E8EDE8] rounded-lg hover:text-red-400 transition-colors'
                                            title='Delete'
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </article>
                                </article>
                                
                            </article>
                            
                        ))}
                        
                    </article>
                )}
                {totalpage > 1 && (
                        <article className='flex justify-center gap-3 mt-8'>
                            <button 
                                onClick={() => FetchMyProducts(page - 1)}
                                disabled={page === 1 || loading}
                                className='px-4 py-2 bg-[#252C26] text-[#E8EDE8] text-sm rounded-lg hover:bg-[#1A1E1B] transition-colors disabled:opacity-50'
                            >
                                Previous
                            </button>
                            <span className='px-4 py-2 text-[#E8EDE8]/60 text-sm'>
                                Page {page} of {totalpage}
                            </span>
                            <button 
                                onClick={() => FetchMyProducts(page + 1)}
                                disabled={page === totalpage || loading}
                                className='px-4 py-2 bg-[#252C26] text-[#E8EDE8] text-sm rounded-lg hover:bg-[#1A1E1B] transition-colors disabled:opacity-50'
                            >
                                Next
                            </button>
                        </article>
                    )}
                

                {/* Delete Confirmation Modal */}
                {deleteId && (
                    <>
                        <article 
                            className='fixed inset-0 z-50 bg-black/50'
                            onClick={() => setDeleteId(null)}
                        />
                        <article className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#252C26] rounded-xl p-6 w-[90%] max-w-sm'>
                            <h3 className='text-white font-semibold text-lg mb-2'>Delete Product?</h3>
                            <p className='text-[#E8EDE8]/60 text-sm mb-6'>This action cannot be undone.</p>
                            <article className='flex gap-3'>
                                <button 
                                    onClick={() => setDeleteId(null)}
                                    className='flex-1 py-2.5 bg-[#1A1E1B] text-[#E8EDE8] text-sm font-semibold rounded-lg hover:bg-[#1A1E1B]/80 transition-colors'
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDelete(deleteId)}
                                    className='flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors'
                                >
                                    Delete
                                </button>
                            </article>
                        </article>
                    </>
                )}

            </article>

            {messages && (
                <article className={`fixed top-4 right-4 z-50 text-white px-4 py-2 rounded ${typColo[messages.type]}`}>
                    {messages.message}
                </article>
            )}
        </section>
    );
};

export default MyProducts;