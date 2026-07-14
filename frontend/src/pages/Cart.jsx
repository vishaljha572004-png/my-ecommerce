import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { offerService } from '../services/offerService';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const { user } = useAuthStore();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  
  const { data: offersData } = useQuery({
    queryKey: ['my-offers'],
    queryFn: offerService.getMyOffers,
    enabled: !!user && items.length > 0
  });

  const validateOfferMutation = useMutation({
    mutationFn: (offerId) => offerService.validateOffer(offerId, subtotal, items),
    onSuccess: (res) => {
      setDiscountAmount(res.data.discountAmount);
      toast.success('Offer applied successfully!');
    },
    onError: (err) => {
      setSelectedOffer(null);
      setDiscountAmount(0);
      toast.error(err.response?.data?.message || 'Failed to apply offer');
    }
  });

  const handleApplyOffer = (offer) => {
    if (selectedOffer?._id === offer._id) {
      setSelectedOffer(null);
      setDiscountAmount(0);
      return;
    }
    setSelectedOffer(offer);
    validateOfferMutation.mutate(offer._id);
  };

  const total = subtotal + deliveryFee - discountAmount;
  const offers = offersData?.data?.data || [];

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="min-h-[70vh] flex flex-col items-center justify-center px-4"
      >
        <div className="w-32 h-32 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 font-medium mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Let's get some fresh groceries!
        </p>
        <Link 
          to="/products" 
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-soft hover:shadow-floating flex items-center gap-2"
        >
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => {
            const currentPrice = item.product.discountedPrice || item.product.price;
            return (
              <div key={`${item.product._id}-${item.product.selectedVariant?.name || 'base'}`} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                <Link to={`/products/${item.product._id}`} className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2 flex items-center justify-center">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img 
                      src={item.product.images[0] || 'https://placehold.co/500x500?text=No+Image'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500?text=No+Image'; }}
                      alt={item.product.name} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-[10px] text-gray-400">No Image</span></div>
                  )}
                </Link>
                
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.product.unit || '1 pc'}</p>
                      <Link to={`/products/${item.product._id}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-black text-gray-900">₹{currentPrice}</span>
                        {item.product.discountedPrice && (
                          <span className="text-xs font-medium text-gray-400 line-through">₹{item.product.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.product._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center justify-between border-2 border-gray-100 rounded-lg p-1 w-32 bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Subtotal</p>
                      <p className="font-black text-lg text-gray-900">₹{currentPrice * item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm sticky top-28">
            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Item Total</span>
                <span className="text-gray-900 font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Fee</span>
                <span className="text-gray-900 font-bold">{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-gray-500">Add ₹{500 - subtotal} more for free delivery</p>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold border-t border-gray-100 pt-2 mt-2">
                  <span>Discount Applied</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
            </div>

            {user && offers.length > 0 && (
              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-gray-900 text-sm">Available Offers</h3>
                </div>
                <div className="space-y-3">
                  {offers.map(offer => (
                    <div 
                      key={offer._id} 
                      onClick={() => handleApplyOffer(offer)}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                        selectedOffer?._id === offer._id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent bg-white hover:border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{offer.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{offer.description}</p>
                        </div>
                        {selectedOffer?._id === offer._id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">To Pay</span>
                <span className="text-3xl font-black text-primary tracking-tight">₹{Math.max(0, total)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">Inclusive of all taxes</p>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-soft hover:shadow-floating flex justify-center items-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
