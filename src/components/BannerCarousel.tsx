'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerAd {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  icon: string;
}

const banners: BannerAd[] = [
  {
    id: 1,
    title: '50% OFF',
    subtitle: 'On Premium Organic Products',
    gradient: 'from-yellow-400 via-yellow-500 to-orange-500',
    icon: '🎯',
  },
  {
    id: 2,
    title: 'Free Shipping',
    subtitle: 'On Orders Over Rs. 5000',
    gradient: 'from-sky-400 via-blue-400 to-blue-500',
    icon: '🚚',
  },
  {
    id: 3,
    title: 'Best Quality',
    subtitle: '100% Certified Organic Products',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    icon: '✅',
  },
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setAutoPlay(false);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative h-64 sm:h-80 rounded-2xl overflow-hidden"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} transition-all duration-500`} />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 z-10">
        <div className="text-6xl sm:text-7xl mb-4">{currentBanner.icon}</div>
        <h2 className="text-3xl sm:text-5xl font-bold mb-2 drop-shadow-lg">
          {currentBanner.title}
        </h2>
        <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
          {currentBanner.subtitle}
        </p>
        <button className="mt-6 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl">
          Shop Now
        </button>
      </div>

      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all duration-200 text-white border border-white/30"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all duration-200 text-white border border-white/30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
