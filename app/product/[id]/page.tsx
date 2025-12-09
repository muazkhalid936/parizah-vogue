"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ProductImageGallery from "@/components/product-image-gallery"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: "stitched" | "unstitched" | "party"
  sizes: string[]
  stock: number
  images: string[]
  video?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
        setSelectedSize(data.sizes[0] || "M") // Set default to first size
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  const handleAddToCart = () => {
    if (!product) return
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    cart.push({ ...product, selectedSize, quantity })
    localStorage.setItem("cart", JSON.stringify(cart))
    router.push("/cart")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-red-500">{error || "Product not found"}</div>
          <Link href="/shop" className="text-primary hover:text-accent mt-4 inline-block">
            ← Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "BDT",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Parizah Vogue"
              }
            },
            "brand": {
              "@type": "Brand",
              "name": "Parizah Vogue"
            },
            "category": product.category,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5", // You can make this dynamic if you have ratings
              "reviewCount": "100"
            }
          }),
        }}
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/shop" className="text-primary hover:text-accent mb-8 inline-block">
            ← Back to Shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <ProductImageGallery images={product.images} productName={product.name} video={product.video} />
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full capitalize">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl text-primary font-bold mb-6">৳{product.price}</p>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Select Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded border transition ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-border rounded hover:bg-muted"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-border rounded hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-accent transition mb-4"
            >
              Add to Cart
            </button>

            <Link
              href="/shop"
              className="block w-full text-center py-3 border border-border rounded hover:bg-muted transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
