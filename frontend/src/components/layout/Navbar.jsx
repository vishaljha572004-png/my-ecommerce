import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Loader2, MapPin, Heart, Package, Tag, Grid, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useDebounce } from '../../hooks/useDebounce';
import { searchService } from '../../services/searchService';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedTerm],
    queryFn: () => searchService.searchProducts(debouncedTerm),
    enabled: debouncedTerm.length > 2,
  });

  const searchResults = data?.data?.products || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-2xl mx-8 hidden md:flex'}`}>
      <div className="relative w-full flex items-center bg-gray-100/80 rounded-xl overflow-hidden border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-soft transition-all duration-300">
        <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleSearch}
          placeholder="Search for groceries, vegetables, meat..."
          className="w-full bg-transparent text-gray-900 py-3 pl-3 pr-4 focus:outline-none placeholder:text-gray-400 text-sm font-medium"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="mr-4 text-xs font-bold text-gray-400 hover:text-gray-600">CLEAR</button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && searchTerm.length > 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-floating border border-gray-100 overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="max-h-96 overflow-y-auto hide-scrollbar py-2">
                {searchResults.map((product) => (
                  <li key={product._id} className="border-b border-gray-50 last:border-0 px-2">
                    <Link 
                      to={`/products/${product._id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=Image'; }} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <img src="https://placehold.co/100x100?text=No+Img" alt="placeholder" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                      </div>
                      <div className="text-sm font-bold text-primary bg-lightBlue px-2 py-1 rounded-md">
                        ₹{product.discountedPrice || product.price}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                  <Search className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900">No products found</p>
                <p className="text-xs text-gray-500">Try searching for something else</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { user } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCartCount());

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-4 lg:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-extrabold text-xl">V</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
                V-<span className="text-primary">Mart</span>
              </span>
            </Link>

            {/* Desktop Navigation Links (Moved to Left) */}
            <div className="hidden xl:flex items-center gap-6 border-l border-gray-200 pl-6 ml-2">
              <Link to="/" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-semibold text-sm">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link to="/products" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-semibold text-sm">
                <Grid className="w-4 h-4" /> Categories
              </Link>
              <Link to="/products?category=offers" className="flex items-center gap-1.5 text-gray-600 hover:text-accentOrange transition-colors font-semibold text-sm">
                <Tag className="w-4 h-4" /> Offers
              </Link>
              {user && (
                <Link to="/profile/orders" className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-semibold text-sm">
                  <Package className="w-4 h-4" /> Orders
                </Link>
              )}
            </div>
          </div>

          <SearchBar isMobile={false} />

          <div className="flex items-center gap-3 sm:gap-5">

            <Link to={user ? "/profile" : "/login"} className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-semibold text-sm">
              <div className="w-10 h-10 rounded-full bg-section flex items-center justify-center hover:bg-lightBlue hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden lg:block">{user ? (user.name ? user.name.split(' ')[0] : 'Profile') : 'Sign In'}</span>
            </Link>
            
            <Link to="/cart" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-soft hover:shadow-floating active:scale-95 group">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-primary text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden w-10 h-10 rounded-xl bg-section flex items-center justify-center text-gray-600 hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
      
      <div className="md:hidden px-4 pb-4">
        <SearchBar isMobile={true} />
      </div>
    </motion.header>
  );
};

export default Navbar;
