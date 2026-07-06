import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-section flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-2xl w-full text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-green-100 text-primary rounded-full flex items-center justify-center mb-8 relative">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-lg">
          Thank you for your order. We've received it and our delivery partners are rushing to fulfill it within the selected time slot.
        </p>
        
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-8 py-4 mb-8">
          <span className="text-gray-500 text-sm block mb-1">Order ID</span>
          <span className="font-mono font-bold text-gray-900 text-lg">#{id || 'ORD-12345678'}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/profile/orders" className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
            Track Order
          </Link>
          <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
