import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { recommendationService } from '../../services/recommendationService';
import ProductCard from '../home/ProductCard';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const RecommendationSection = ({ type, productId }) => {
  const { t } = useTranslation();

  const getQueryConfig = () => {
    switch(type) {
      case 'personalized':
        return {
          key: ['recommendations', 'personalized'],
          fn: recommendationService.getPersonalized,
          title: t('product.recommendedForYou') || 'Recommended For You'
        };
      case 'frequentlyBought':
        return {
          key: ['recommendations', 'frequentlyBought', productId],
          fn: () => recommendationService.getFrequentlyBoughtTogether(productId),
          title: t('product.frequentlyBoughtTogether') || 'Frequently Bought Together'
        };
      case 'similar':
        return {
          key: ['recommendations', 'similar', productId],
          fn: () => recommendationService.getSimilar(productId),
          title: t('product.similarProducts') || 'Similar Products'
        };
      default:
        return null;
    }
  };

  const config = getQueryConfig();

  const { data, isLoading, isError } = useQuery({
    queryKey: config?.key,
    queryFn: config?.fn,
    enabled: !!config,
    staleTime: 5 * 60 * 1000 // 5 mins
  });

  if (!config) return null;
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  
  const products = data?.data?.data || [];
  if (isError || products.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{config.title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
