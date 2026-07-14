import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const { user, accessToken } = useAuthStore();

  if (accessToken && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-section flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-floating transition-all border border-gray-100">
              <span className="text-white font-extrabold text-xl">V</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              V-<span className="text-primary">Mart</span>
            </span>
          </Link>
        </motion.div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
