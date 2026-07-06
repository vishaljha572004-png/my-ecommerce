import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import { motion } from 'framer-motion';

const CategorySection = ({ category }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'category', category._id],
    queryFn: () => productService.getAllProducts({ category: category._id, limit: 3 }),
  });

  const products = data?.data?.products || [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{category.name}</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Explore fresh and premium {category.name.toLowerCase()}</p>
        </div>
        <Link to={`/products?category=${category._id}`} className="text-primary font-bold text-sm flex items-center hover:underline">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-[320px]">
              <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
