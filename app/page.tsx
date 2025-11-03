"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const products = await response.json()
        // Get first 6 products as featured
        setFeaturedProducts(products.slice(0, 6))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-secondary text-card flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(/cover.jpg",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">Elegance Redefined</h1>
          <p className="text-lg md:text-xl mb-8 text-card/90">Shop the Latest Fashion Trends</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-accent transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Featured Collection</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-card border border-border rounded overflow-hidden animate-pulse">
                <div className="h-64 bg-muted" />
                <div className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-muted rounded w-20" />
                    <div className="h-10 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-card border border-border rounded overflow-hidden hover:shadow-lg transition">
                <div
                  className="h-64 bg-muted"
                  style={{
                    backgroundImage: `url(${product.images[0] || "/placeholder.svg?height=256&width=256&query=luxury%20women%20dress"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <Link
                      href={`/product/${product._id}`}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-primary hover:text-primary-foreground transition"
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
            <p className="text-muted-foreground text-lg">No products available at the moment.</p>
            <p className="text-muted-foreground text-sm mt-2">Check back later for new arrivals!</p>
          </div>
        )}
      </section>

      {/* Category Section */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Casual", "Formal", "Party Wear"].map((category) => (
              <Link key={category} href={`/shop?category=${category.toLowerCase()}`} className="group">
                <div className="bg-card p-8 rounded text-center hover:bg-primary hover:text-primary-foreground transition cursor-pointer">
                  <h3 className="text-xl font-semibold group-hover:text-primary-foreground">{category}</h3>
                  <p className="text-sm mt-2 group-hover:text-primary-foreground/80">Explore collection</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 Parizah Vogue. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
