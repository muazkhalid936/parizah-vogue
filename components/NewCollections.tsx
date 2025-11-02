'use client';

import { ArrowRight, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const NewCollections = () => {
  const collections = [
    {
      id: 1,
      title: "Summer Essentials",
      description: "Light, breezy pieces perfect for warm weather adventures",
      image: "🌞",
      items: "24 Items",
      tag: "New Arrival",
      color: "from-orange-400 to-pink-400"
    },
    {
      id: 2,
      title: "Professional Wear",
      description: "Sophisticated styles for the modern workplace",
      image: "👔",
      items: "18 Items",
      tag: "Trending",
      color: "from-blue-400 to-indigo-400"
    },
    {
      id: 3,
      title: "Casual Comfort",
      description: "Relaxed fits for everyday comfort and style",
      image: "👕",
      items: "32 Items",
      tag: "Best Seller",
      color: "from-green-400 to-teal-400"
    },
    {
      id: 4,
      title: "Evening Elegance",
      description: "Stunning pieces for special occasions and nights out",
      image: "✨",
      items: "15 Items",
      tag: "Limited",
      color: "from-purple-400 to-pink-400"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton Shirt",
      price: "$89",
      originalPrice: "$120",
      image: "👕",
      badge: "25% OFF"
    },
    {
      id: 2,
      name: "Designer Handbag",
      price: "$299",
      originalPrice: "$399",
      image: "👜",
      badge: "NEW"
    },
    {
      id: 3,
      name: "Classic Denim Jacket",
      price: "$149",
      originalPrice: "$199",
      image: "🧥",
      badge: "SALE"
    },
    {
      id: 4,
      name: "Elegant Dress",
      price: "$199",
      originalPrice: "$259",
      image: "👗",
      badge: "TRENDING"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-blue-600 font-semibold uppercase tracking-wide">New Collections</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover What's 
            <span className="text-blue-600"> Trending</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our latest collections featuring the most sought-after styles 
            and timeless pieces curated just for you.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {collections.map((collection) => (
            <div 
              key={collection.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative p-6">
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                    <Tag className="h-3 w-3 mr-1" />
                    {collection.tag}
                  </span>
                  <span className="text-sm text-gray-500">{collection.items}</span>
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4 text-center">
                  {collection.image}
                </div>

                {/* Text */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {collection.description}
                  </p>
                  
                  <button className="group-hover:bg-blue-600 group-hover:text-white border border-gray-200 group-hover:border-blue-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 w-full">
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Featured Products
              </h3>
              <p className="text-gray-600">
                Hand-picked items from our latest collections
              </p>
            </div>
            
            <Link 
              href="/products"
              className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                    {product.badge}
                  </span>
                </div>

                {/* Product Image */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{product.image}</div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg font-bold text-blue-600">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  
                  <button className="mt-4 w-full bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-900 py-2 px-4 rounded-lg font-semibold transition-all duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewCollections;