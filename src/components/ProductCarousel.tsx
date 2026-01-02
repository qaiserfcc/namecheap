'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/pricing';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  officialPrice: number;
  discountedPrice: number;
  imageUrl: string | null;
  stock: number;
  priceComparison: {
    savings: number;
    savingsPercentage: number;
  };
}

interface ProductCarouselProps {
  title?: string;
  products: Product[];
  isDark?: boolean;
}

export default function ProductCarousel({ title, products, isDark = false }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const itemsPerView = 4;

  useEffect(() => {
    if (!isAutoPlay || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / itemsPerView));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, products.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / itemsPerView)) % Math.ceil(products.length / itemsPerView));
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / itemsPerView));
    setIsAutoPlay(false);
  };

  if (products.length === 0) return null;

  const visibleProducts = products.slice(currentIndex * itemsPerView, (currentIndex + 1) * itemsPerView);

  return (
    <div className={`py-12 px-4 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-transparent'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className={`
                  backdrop-blur-md bg-white/10 border border-white/20 rounded-xl overflow-hidden
                  hover:border-yellow-400/50 hover:bg-white/15 transition-all duration-300
                  ${isDark ? 'shadow-xl shadow-yellow-500/20' : 'shadow-lg'}
                `}>
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-blue-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-6xl text-gray-400">📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-yellow-500">
                          {formatCurrency(product.discountedPrice)}
                        </span>
                        {product.priceComparison.savings > 0 && (
                          <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">
                            -{product.priceComparison.savingsPercentage.toFixed(0)}%
                          </span>
                        )}
                      </div>

                      {product.priceComparison.savings > 0 && (
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through`}>
                          {formatCurrency(product.officialPrice)}
                        </p>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mt-3">
                      {product.stock > 0 ? (
                        <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-400 bg-red-900/30 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Buttons */}
          {Math.ceil(products.length / itemsPerView) > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentIndex 
                        ? 'bg-yellow-500 w-8' 
                        : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
