import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, CheckCircle, Loader2, MapPin, Clock, Banknote, Smartphone } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();
  
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      pincode: '',
    }
  });

  const totalAmount = getCartTotal();
  const deliveryCharge = totalAmount > 500 ? 0 : 50;
  const finalAmount = totalAmount + deliveryCharge;

  const orderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (data) => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.data?._id || '123'}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  });

  const onSubmitAddress = (data) => {
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!selectedSlot) {
      toast.error('Please select a delivery slot');
      return;
    }
    
    const addressData = getValues();
    
    orderMutation.mutate({
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        variant: item.product.selectedVariant?.name,
        price: item.product.discountedPrice || item.product.price
      })),
      totalAmount: finalAmount,
      paymentMethod,
      deliverySlot: selectedSlot,
      deliveryAddress: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state || 'Maharashtra',
        postalCode: addressData.pincode,
        country: 'India'
      }
    });
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        
        <div className="flex-1 space-y-6">
          
          
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border transition-all duration-300 ${step === 1 ? 'border-primary shadow-soft' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 1 ? 'bg-primary text-white shadow-soft' : 'bg-lightBlue text-primary'}`}>
                {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
              </div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Delivery Address
                {step === 1 && <MapPin className="w-5 h-5 text-gray-400" />}
              </h2>
            </div>
            
            {step === 1 ? (
              <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                    <input {...register('fullName', { required: true })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <input {...register('phone', { required: true })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Street Address</label>
                  <input {...register('street', { required: true })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" placeholder="123 Main Street, Apt 4B" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">City</label>
                    <input {...register('city', { required: true })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Pincode</label>
                    <input {...register('pincode', { required: true })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" placeholder="400001" />
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button type="submit" className="bg-primary hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-soft">
                    Save Address & Continue
                  </button>
                </div>
              </form>
            ) : (
              <div className="pl-14 flex items-center justify-between">
                <div className="text-gray-600 font-medium bg-gray-50 p-4 rounded-xl flex-1 mr-4">
                  Address details saved successfully.
                </div>
                <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline shrink-0 bg-primary/10 px-4 py-2 rounded-lg">Edit</button>
              </div>
            )}
          </div>

          
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border transition-all duration-300 ${step === 2 ? 'border-primary shadow-soft' : 'border-gray-100'} ${step < 2 && 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 2 ? 'bg-primary text-white shadow-soft' : step > 2 ? 'bg-lightBlue text-primary' : 'bg-gray-100 text-gray-400'}`}>
                {step > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
              </div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                Delivery Slot
                {step === 2 && <Clock className="w-5 h-5 text-gray-400" />}
              </h2>
            </div>
            
            {step === 2 ? (
              <div className="space-y-6 pl-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Within 10 Mins (Instant)', 'Today 2:00 PM - 4:00 PM', 'Today 5:00 PM - 7:00 PM', 'Tomorrow 10:00 AM - 12:00 PM'].map((slot, idx) => (
                    <label key={idx} className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedSlot === slot ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="slot" 
                        value={slot} 
                        checked={selectedSlot === slot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="text-primary focus:ring-primary w-5 h-5 mr-4"
                      />
                      <span className={`font-bold ${selectedSlot === slot ? 'text-primary' : 'text-gray-700'}`}>{slot}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button onClick={() => { if(selectedSlot) setStep(3); else toast.error('Select a slot'); }} className="bg-primary hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-soft">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            ) : step > 2 ? (
              <div className="pl-14 flex items-center justify-between">
                <div className="text-gray-600 font-medium bg-gray-50 p-4 rounded-xl flex-1 mr-4">
                  {selectedSlot}
                </div>
                <button onClick={() => setStep(2)} className="text-primary font-bold hover:underline shrink-0 bg-primary/10 px-4 py-2 rounded-lg">Edit</button>
              </div>
            ) : null}
          </div>

          
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border transition-all duration-300 ${step === 3 ? 'border-primary shadow-soft' : 'border-gray-100'} ${step < 3 && 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step === 3 ? 'bg-primary text-white shadow-soft' : 'bg-gray-100 text-gray-400'}`}>
                3
              </div>
              <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
            </div>
            
            {step === 3 && (
              <div className="pl-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                  ].map((method) => (
                    <label key={method.id} className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all text-center ${paymentMethod === method.id ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 text-gray-500 hover:border-primary/30 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id} 
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <method.icon className={`w-8 h-8 mb-3 ${paymentMethod === method.id ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <img src={item.product.images[0] || 'https://placehold.co/100x100?text=No+Img'} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Img'; }} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Qty: {item.quantity} × ₹{item.product.discountedPrice || item.product.price}</p>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    ₹{(item.product.discountedPrice || item.product.price) * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Charge</span>
                <span className="font-bold">
                  {deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>
              
            <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-end">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-primary tracking-tight">₹{finalAmount}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={step < 3 || orderMutation.isPending}
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-soft hover:shadow-floating disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : `Place Order • ₹${finalAmount}`}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 font-medium">By placing an order, you agree to our Terms & Conditions.</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Checkout;
