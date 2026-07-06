import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronDown, Check, Search } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/common/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { category: selectedCategory !== 'all' ? selectedCategory : null, search: searchQuery }],
    queryFn: () => productService.getAllProducts({ 
      category: selectedCategory !== 'all' ? selectedCategory : null,
      search: searchQuery
    }),
  });

  const categories = categoriesData?.data?.categories || [];
  let products = productsData?.data?.products || [];

  // Client-side sorting
  if (sortOption === 'price-low') {
    products = [...products].sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
  } else if (sortOption === 'price-high') {
    products = [...products].sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsMobileFiltersOpen(false);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {products.length} {products.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 shadow-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative group">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 font-bold py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
            <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${selectedCategory === 'all' ? 'bg-lightBlue text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Products
                  {selectedCategory === 'all' && <Check className="w-4 h-4" />}
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${selectedCategory === cat._id ? 'bg-lightBlue text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                    {selectedCategory === cat._id && <Check className="w-4 h-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm md:hidden flex justify-end"
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-lg text-gray-900">Filters</h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Categories</h4>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${selectedCategory === 'all' ? 'border-primary bg-lightBlue text-primary' : 'border-gray-100 text-gray-700'}`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          onClick={() => handleCategoryChange(cat._id)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold border transition-colors ${selectedCategory === cat._id ? 'border-primary bg-lightBlue text-primary' : 'border-gray-100 text-gray-700'}`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-[320px]">
                  <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 font-medium mb-6">
                We couldn't find anything matching your current filters.
              </p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-soft"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default Products;
