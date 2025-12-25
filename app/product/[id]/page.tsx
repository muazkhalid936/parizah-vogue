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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)

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
        if (data.category !== "unstitched") {
          setSelectedSize(data.sizes[0] || "M") // Set default to first size for stitched products
        } else {
          setSelectedSize("") // No size for unstitched
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

  useEffect(() => {
    // Fetch related products in the same category once product is loaded
    const controller = new AbortController()
    ;(async () => {
      if (!product) return
      try {
        setRelatedLoading(true)
        const url = `/api/products?category=${encodeURIComponent(product.category)}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          setRelatedProducts([])
          return
        }
        const data: Product[] = await res.json()
        // Exclude current product and limit to 8
        const filtered = data.filter((p) => p._id !== product._id).slice(0, 8)
        setRelatedProducts(filtered)
      } catch (err) {
        if ((err as any)?.name === "AbortError") return
        console.error("Failed to fetch related products:", err)
        setRelatedProducts([])
      } finally {
        setRelatedLoading(false)
      }
    })()
    return () => controller.abort()
  }, [product])

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
            {product.category !== "unstitched" && (
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
            )}

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
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          {relatedLoading ? (
            <div className="text-muted-foreground">Loading related products...</div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <div
                  key={rp._id}
                  className="bg-card border border-border rounded overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-muted relative">
                    {rp.images && rp.images.length > 0 ? (
                      <div
                        className="h-48 w-full bg-center bg-cover"
                        style={{ backgroundImage: `url('${rp.images[0]}')` }}
                      />
                    ) : (
                      <div
                        className="h-48 w-full bg-center bg-cover"
                        style={{ backgroundImage: `url('/placeholder.svg?height=192&width=192')` }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold mb-1">{rp.name}</h3>
                    <p className="text-muted-foreground text-xs mb-3 capitalize">{rp.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">৳{rp.price}</span>
                      <Link
                        href={`/product/${rp._id}`}
                        className="bg-secondary text-secondary-foreground px-3 py-2 rounded hover:bg-primary hover:text-primary-foreground transition text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No related products found.</div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
