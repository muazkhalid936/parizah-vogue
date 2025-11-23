"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Product {
  _id: string
  name: string
  price: number
  category: "stitched" | "unstitched" | "party" | string
  images?: string[]
  video?: string
  description?: string
  sizes?: string[]
  stock?: number
  featured?: boolean
}

export default function Shop() {
  const searchParams = useSearchParams()
  const [priceFilter, setPriceFilter] = useState(200)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setCategoryFilter(category)
    }
  }, [searchParams])

  useEffect(() => {
    // fetch products from API; supports category via query param
    const controller = new AbortController()
    ;(async () => {
      try {
        const params = new URLSearchParams()
        if (categoryFilter) params.set("category", categoryFilter)
        const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          setProducts([])
          return
        }
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        if ((err as any)?.name === "AbortError") return
        console.error("Failed to fetch products:", err)
        setProducts([])
      }
    })()
    return () => controller.abort()
  }, [categoryFilter])

  useEffect(() => {
    // apply client-side price filter (and category is applied server-side when available)
    let filtered = products
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter)
    }
    filtered = filtered.filter((p) => p.price <= priceFilter)
    setFilteredProducts(filtered)
  }, [products, categoryFilter, priceFilter])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Shop Our Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-6">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {["stitched", "unstitched", "party"].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={categoryFilter === cat}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{cat}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={categoryFilter === ""}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-medium mb-3">Price: ${priceFilter}</h4>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-64 bg-muted relative">
                      {product.images && product.images.length > 0 ? (
                        <div
                          className="h-64 w-full bg-center bg-cover"
                          style={{ backgroundImage: `url('${product.images[0]}')` }}
                        />
                      ) : (
                        <div
                          className="h-64 w-full bg-center bg-cover"
                          style={{ backgroundImage: `url('/placeholder.svg?height=256&width=256')` }}
                        />
                      )}
                      {product.video && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12l-6-4h12l-6 4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 capitalize">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <Link
                          href={`/product/${product._id}`}
                          className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-primary hover:text-primary-foreground transition text-sm"
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
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
