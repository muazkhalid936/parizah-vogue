"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  isNew: boolean;
  trending: boolean;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  icon: React.ReactNode;
  viewAllLink: string;
}

function ProductSection({
  title,
  products,
  loading,
  icon,
  viewAllLink,
}: ProductSectionProps) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-card border border-border rounded-lg overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-muted" />
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-3" />
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-8 bg-muted rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>
        <Link
          href={viewAllLink}
          className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
        >
          <span className="hidden sm:inline">View All</span>
          <ArrowRight size={20} />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={
                    product.images[0] || "/placeholder.svg?height=400&width=300"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-3 text-xs sm:text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-bold text-primary">
                    ৳{product.price}
                  </span>
                  <Link
                    href={`/product/${product._id}`}
                    className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products available in this section.
          </p>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch featured products
      const featured = await fetch("/api/products?featured=true");
      if (featured.ok) {
        const featuredData = await featured.json();
        setFeaturedProducts(featuredData);
      }

      // Fetch new products
      const newCollection = await fetch("/api/products?isNew=true");
      if (newCollection.ok) {
        const newData = await newCollection.json();
        setNewProducts(newData);
      }

      // Fetch trending products
      const trending = await fetch("/api/products?trending=true");
      if (trending.ok) {
        const trendingData = await trending.json();
        setTrendingProducts(trendingData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/cover.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Foreground Content */}
        <div className="relative z-10 text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-primary">
            Elegance Redefined
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-foreground/80 max-w-2xl mx-auto">
            Discover the latest in fashion with our curated collection of
            premium clothing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg hover:bg-accent transition-colors font-semibold"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?category=new"
              className="inline-block border border-primary text-primary px-6 sm:px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
            >
              New Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductSection
        title="Featured Collection"
        products={featuredProducts}
        loading={loading}
        icon={<Star className="text-primary" size={24} />}
        viewAllLink="/shop?featured=true"
      />

      {/* New Collection */}
      <div className="bg-muted/30">
        <ProductSection
          title="New Collection"
          products={newProducts}
          loading={loading}
          icon={<Sparkles className="text-accent" size={24} />}
          viewAllLink="/shop?isNew=true"
        />
      </div>

      {/* Trending Products */}
      <ProductSection
        title="Trending Now"
        products={trendingProducts}
        loading={loading}
        icon={<TrendingUp className="text-destructive" size={24} />}
        viewAllLink="/shop?trending=true"
      />

      {/* Category Section */}
      <section className="bg-gradient-to-b from-muted/50 to-muted py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Stitched",
                category: "stitched",
                description: "Ready to wear premium clothing",
              },
              {
                name: "Unstitched",
                category: "unstitched",
                description: "Premium fabrics for custom tailoring",
              },
              {
                name: "Party Wear",
                category: "party",
                description: "Elegant outfits for special occasions",
              },
            ].map((item) => (
              <Link
                key={item.category}
                href={`/shop?category=${item.category}`}
                className="group"
              >
                <div className="bg-card p-6 sm:p-8 rounded-lg text-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary-foreground">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Parizah Vogue</h3>
              <p className="text-sm text-secondary-foreground/80">
                Premium fashion for the modern woman. Elegance redefined.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/shop"
                  className="block hover:text-primary transition-colors"
                >
                  Shop
                </Link>
                <Link
                  href="/shop?featured=true"
                  className="block hover:text-primary transition-colors"
                >
                  Featured
                </Link>
                <Link
                  href="/shop?isNew=true"
                  className="block hover:text-primary transition-colors"
                >
                  New Collection
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="/shop?category=stitched"
                  className="block hover:text-primary transition-colors"
                >
                  Stitched
                </Link>
                <Link
                  href="/shop?category=unstitched"
                  className="block hover:text-primary transition-colors"
                >
                  Unstitched
                </Link>
                <Link
                  href="/shop?category=party"
                  className="block hover:text-primary transition-colors"
                >
                  Party Wear
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-secondary-foreground/80">
                <p>Email: info@parizahvogue.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-6 text-center text-sm">
            <p>&copy; 2025 Parizah Vogue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>

  );
}
