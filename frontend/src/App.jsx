import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import NotFound from './pages/NotFound';
import { AnimatePresence } from 'framer-motion';
import { useSocket } from './hooks/useSocket';

// Lazy loading pages for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const ShoppingLists = lazy(() => import('./pages/ShoppingLists'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-section">
    <Loader2 className="w-10 h-10 animate-spin text-primary" />
  </div>
);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  useSocket(); // Initialize real-time connection if user is logged in

  React.useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/shopping-lists" element={<ShoppingLists />} />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
