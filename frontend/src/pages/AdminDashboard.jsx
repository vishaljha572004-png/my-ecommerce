import { useState } from 'react';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminCategories from '../components/admin/AdminCategories';
import AdminProducts from '../components/admin/AdminProducts';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { name: 'Total Orders', value: '845', change: '+5.2%', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { name: 'Total Users', value: '1,240', change: '+18.1%', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { name: 'Products', value: '256', change: '+2.4%', icon: Package, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="flex h-screen bg-section overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-full shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-white font-extrabold text-xl">V</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              V-Admin
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Management</h2>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-soft' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-bold transition-colors text-sm">
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-section">
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 capitalize">{activeTab}</h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> System Online
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-soft transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Orders Placeholder */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-black text-gray-900">Recent Orders</h3>
                    <button className="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#ORD-{1000 + i}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">John Doe {i}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">Today, 10:45 AM</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{450 * i}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-md uppercase tracking-wider ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {i % 2 === 0 ? 'Delivered' : 'Processing'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdminCategories />
              </motion.div>
            )}
            
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdminProducts />
              </motion.div>
            )}
            
            {activeTab !== 'overview' && activeTab !== 'categories' && activeTab !== 'products' && (
              <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
                <p className="text-gray-500 font-medium">This module is under construction.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
