import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { User, Package, Settings, LogOut, MapPin, Edit, ChevronRight, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getUserOrders,
  });

  const queryClient = useQueryClient();
  const cancelMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries(['my-orders']);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Error cancelling order')
  });

  const handleCancelOrder = (orderId) => {
    if(window.confirm('Are you sure you want to cancel this order?')) {
      cancelMutation.mutate(orderId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-28">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-soft">
                {user?.firstName?.[0] || <User />}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-gray-500 font-medium mt-0.5">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-lightBlue text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <tab.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    {tab.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all mt-4 border border-transparent hover:border-red-100"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Order History</h3>
                  
                  {loadingOrders ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse h-32 bg-gray-100 rounded-2xl"></div>
                      ))}
                    </div>
                  ) : ordersData?.data?.orders?.length > 0 ? (
                    <div className="space-y-4">
                      {ordersData.data.orders.map((order) => (
                        <div key={order._id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-soft transition-all bg-gray-50/50">
                          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order #{order._id.slice(-8)}</p>
                              <p className="text-gray-900 font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                              <span className={`inline-flex px-3 py-1 text-xs font-black rounded-md uppercase tracking-wider
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                  'bg-yellow-100 text-yellow-700'}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                              <p className="text-xl font-black text-gray-900">₹{order.totalAmount}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar border-t border-gray-100 pt-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="w-16 h-16 shrink-0 bg-white rounded-xl p-1.5 border border-gray-100 flex items-center justify-center relative group">
                                <img 
                                  src={item.productImage || 'https://placehold.co/100x100?text=No+Img'} 
                                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Img'; }}
                                  alt={item.productName || 'Product'} 
                                  className="w-full h-full object-contain"
                                />
                                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                  {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <HelpCircle className="w-4 h-4" />
                                <span>Need help? You can cancel your order before it processes.</span>
                              </div>
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancelMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="text-xl font-black text-gray-900 mb-2">No orders yet</h4>
                      <p className="text-gray-500 font-medium max-w-sm mx-auto mb-6">Looks like you haven't made your first purchase. Explore our fresh products today!</p>
                      <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-soft">
                        Start Shopping
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900">Saved Addresses</h3>
                    <button className="text-primary font-bold text-sm hover:underline bg-lightBlue px-4 py-2 rounded-lg">Add New</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-primary bg-lightBlue rounded-2xl p-6 relative">
                      <div className="absolute top-6 right-6 flex gap-2">
                        <button className="text-gray-400 hover:text-primary"><Edit className="w-4 h-4" /></button>
                      </div>
                      <span className="inline-block px-3 py-1 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-md mb-4 shadow-sm">Default Home</span>
                      <h4 className="font-bold text-gray-900 mb-1">{user?.firstName} {user?.lastName}</h4>
                      <p className="text-gray-600 text-sm mb-4">123 Main Street, Apt 4B<br/>Mumbai, MH 400001</p>
                      <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
                        <span className="text-gray-400">Phone:</span> {user?.phone || '+91 9876543210'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Account Settings</h3>
                  
                  <form className="max-w-md space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input type="text" defaultValue={user?.firstName} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input type="text" defaultValue={user?.lastName} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input type="email" defaultValue={user?.email} disabled className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-gray-500 font-medium cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" defaultValue={user?.phone} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium" />
                    </div>
                    
                    <button type="button" className="bg-primary hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-soft mt-4">
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
