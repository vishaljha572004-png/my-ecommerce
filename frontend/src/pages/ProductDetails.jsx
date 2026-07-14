import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Share2, Heart, ShieldCheck, Truck, Clock, Loader2 } from 'lucide-react';
import { productService } from '../services/productService';
import { useCartStore } from '../stores/useCartStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { recommendationService } from '../services/recommendationService';
import RecommendationSection from '../components/common/RecommendationSection';
import { useEffect } from 'react';
const ProductDetails = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const addToCart = useCartStore((state) => state.addToCart);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  useEffect(() => {
    if (data?.data?.product?._id) {
      recommendationService.logInteraction(data.data.product._id, 'view');
    }
  }, [data?.data?.product?._id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 flex flex-col gap-4 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-3xl"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 animate-pulse">
            <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-3/4 h-12 bg-gray-200 rounded-xl"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded-xl"></div>
            <div className="w-1/3 h-10 bg-gray-200 rounded-xl"></div>
            <div className="w-full h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const product = data?.data?.product;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Product not found</h2>
        <Link to="/products" className="text-primary font-bold hover:underline">
          Return to products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart`);
    setTimeout(() => setIsAdding(false), 300);
  };

  const images = product.images?.length > 0 ? product.images : ['https://placehold.co/800x800?text=No+Image'];
  const discountPercentage = product.price && product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;
  const currentPrice = product.discountedPrice || product.price;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          
          <div className="w-full md:w-1/2 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col gap-6 bg-gray-50/50">
            <div className="bg-white rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative shadow-sm border border-gray-100 p-8">
              {discountPercentage > 0 && (
                <div className="absolute top-6 left-0 bg-accentOrange text-white text-sm font-black px-4 py-1.5 rounded-r-lg z-10 shadow-sm">
                  {discountPercentage}% OFF
                </div>
              )}
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImage] || 'https://placehold.co/800x800?text=No+Image'} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x800?text=No+Image'; }}
                alt={product.name} 
                className="w-full h-full object-contain" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 ${activeImage === idx ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors bg-white shadow-sm`}
                  >
                    <img 
                      src={img || 'https://placehold.co/100x100?text=No+Image'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-2">{product.unit || '1 pc'}</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 bg-accentYellow/20 text-accentOrange px-2.5 py-1 rounded-md text-sm font-bold">
                4.8 <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-gray-400 text-sm font-medium">1.2k Ratings</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-black text-gray-900 tracking-tight">₹{currentPrice}</span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-400 font-bold line-through mb-1">₹{product.price}</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-1.5">You save ₹{product.price - currentPrice}</span>
                </>
              )}
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <span>Delivery in <strong className="text-gray-900">10 Minutes</strong></span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span>100% Quality Guarantee</span>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-1.5 w-full sm:w-40 bg-gray-50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-black text-lg text-gray-900 w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-soft hover:shadow-floating flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isAdding ? (
                      <div className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Adding...</div>
                    ) : (
                      <div className="flex items-center gap-2"><ShoppingCart className="w-6 h-6" /> Add to Cart</div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 text-center py-4 rounded-xl font-bold text-lg border border-red-100">
                  Out of Stock
                </div>
              )}
            </div>

          </div>
        </div>
        
        {product.description && (
          <div className="border-t border-gray-100 p-6 md:p-12 bg-gray-50/50">
            <h3 className="text-xl font-black text-gray-900 mb-4">Product Details</h3>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 space-y-8">
        <RecommendationSection type="frequentlyBought" productId={product._id} />
        <RecommendationSection type="similar" productId={product._id} />
      </div>
    </motion.div>
  );
};

export default ProductDetails;
