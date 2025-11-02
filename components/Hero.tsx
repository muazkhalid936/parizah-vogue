'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300 text-sm">Trusted by 10,000+ customers</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> Style</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Discover premium fashion that speaks to your individuality. From timeless classics to contemporary trends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="group bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
              >
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/categories"
                className="border-2 border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
              >
                Browse Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-gray-400 text-sm">Premium Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-gray-400 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99%</div>
                <div className="text-gray-400 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div className="text-6xl mb-4">👗</div>
                  <div className="text-lg font-semibold">Fashion Excellence</div>
                  <div className="text-sm">Premium Quality Guaranteed</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;