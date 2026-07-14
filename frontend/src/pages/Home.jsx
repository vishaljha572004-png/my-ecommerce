import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Truck, ShieldCheck, Clock, Tag } from 'lucide-react';
import React from 'react';
import { categoryService } from '../services/categoryService';
import CategorySection from '../components/home/CategorySection';
import RecommendationSection from '../components/common/RecommendationSection';
import { motion } from 'framer-motion';

const Home = () => {
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  const categories = categoriesData?.data?.categories || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12 pb-20"
    >
      
      <section className="bg-lightBlue pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-soft flex flex-col md:flex-row relative">
            <div className="p-8 md:p-16 flex-1 flex flex-col justify-center z-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 bg-accentOrange/10 text-accentOrange font-black text-xs uppercase tracking-wider rounded-full mb-4">
                  Lightning Fast Delivery
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                  Groceries delivered in <span className="text-primary">10 minutes</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8 max-w-md font-medium">
                  Get fresh produce, daily essentials, and more delivered straight to your door at unbeatable prices.
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-soft hover:shadow-floating">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2 relative bg-lightBlue flex items-center justify-center min-h-[300px]">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" 
                alt="Fresh Groceries" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-lightBlue rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">10 Min Delivery</h3>
              <p className="text-sm text-gray-500">Superfast doorstep delivery</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accentYellow/20 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-accentYellow" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Best Quality</h3>
              <p className="text-sm text-gray-500">Fresh and authentic products</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-accentOrange/10 rounded-full flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-accentOrange" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Great Offers</h3>
              <p className="text-sm text-gray-500">Best prices guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendationSection type="personalized" />
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
        </div>

        {loadingCategories ? (
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center gap-4 shrink-0">
                <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-200 rounded-[2rem]"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex justify-start md:justify-center overflow-x-auto gap-4 sm:gap-6 pb-6 pt-4 hide-scrollbar snap-x w-full"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={itemVariants} className="shrink-0 snap-start">
                <Link to={`/products?category=${category._id}`} className="block relative cursor-pointer group w-40 sm:w-48 md:w-56 h-56 sm:h-64 md:h-72 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-2">
                  {category.image ? (
                    <img 
                      src={category.image || 'https://placehold.co/300x300/EAF3FF/2563EB?text=No+Image'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/EAF3FF/2563EB?text=${encodeURIComponent(category.name)}`; }} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-lg">
                      {category.name}
                    </span>
                    <div className="w-10 h-1 bg-primary mt-3 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-r from-accentOrange to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[200px] shadow-sm">
             <h3 className="text-3xl font-black mb-2 relative z-10">Up to 50% OFF</h3>
             <p className="font-medium text-white/90 relative z-10 mb-4">On Fresh Fruits & Vegetables</p>
             <Link to="/products" className="bg-white text-accentOrange w-fit px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors z-10 shadow-sm">Explore Now</Link>
           </div>
           <div className="bg-gradient-to-r from-secondary to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[200px] shadow-sm">
             <h3 className="text-3xl font-black mb-2 relative z-10">Dairy Specials</h3>
             <p className="font-medium text-white/90 relative z-10 mb-4">Fresh milk, cheese & more</p>
             <Link to="/products" className="bg-white text-secondary w-fit px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors z-10 shadow-sm">Shop Dairy</Link>
           </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-floating">
          <div className="relative z-10 text-white max-w-lg mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Get the V-Mart App for exclusive offers!</h2>
            <p className="text-white/80 font-medium mb-8">Download our app and get ₹100 off on your first order. Available on iOS and Android.</p>
            <div className="flex gap-4">
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                App Store
              </button>
              <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                Play Store
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-1/3 flex justify-center">
            <div className="w-64 h-80 bg-white rounded-t-3xl shadow-2xl border-8 border-gray-900 border-b-0 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-10 bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">V-Mart App</span>
              </div>
              <div className="absolute top-12 inset-x-4 h-24 bg-gray-100 rounded-xl"></div>
              <div className="absolute top-40 inset-x-4 bottom-0 flex flex-wrap gap-2">
                <div className="w-[48%] h-24 bg-gray-100 rounded-xl"></div>
                <div className="w-[48%] h-24 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
