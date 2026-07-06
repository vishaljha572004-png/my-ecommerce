import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Loader2, Star } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(product, 1);
    toast.success('Added to cart', { position: 'bottom-center' });
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      addToCart(product, quantity + 1);
    } else {
      toast.error(`Only ${product.stock} items left in stock`, { position: 'bottom-center' });
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      addToCart(product, quantity - 1);
    }
  };

  const discountPercentage = product.price && product.discountedPrice
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;
    
  const currentPrice = product.discountedPrice || product.price;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-floating transition-all duration-300 p-4 flex flex-col h-full relative group hover:border-primary/20"
    >
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-0 bg-accentOrange text-white text-[10px] font-black px-2 py-1 rounded-r-md z-10 shadow-sm">
          {discountPercentage}% OFF
        </div>
      )}
      
      <Link to={`/products/${product._id}`} className="block relative aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-4">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0] || 'https://placehold.co/500x500?text=No+Image'} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500?text=No+Image'; }}
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <img src="https://placehold.co/500x500?text=No+Img" alt="placeholder" className="w-full h-full object-contain" />
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{product.unit || '1 pc'}</p>
          <div className="flex items-center gap-1 bg-accentYellow/10 px-1.5 py-0.5 rounded text-accentOrange text-[10px] font-bold">
            <Star className="w-3 h-3 fill-accentOrange text-accentOrange" /> 4.5
          </div>
        </div>
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-gray-900 tracking-tight">₹{currentPrice}</span>
              {discountPercentage > 0 && (
                <span className="text-xs text-gray-400 font-medium line-through">₹{product.price}</span>
              )}
            </div>
          </div>

          <div className="w-24">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-primary text-white rounded-lg p-1 shadow-sm">
                <button 
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAdd}
                disabled={isAdding || product.stock === 0}
                className="w-full py-2 border border-primary/20 text-primary font-bold text-sm rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 flex items-center justify-center h-[36px]"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : product.stock === 0 ? 'OUT' : 'ADD'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
