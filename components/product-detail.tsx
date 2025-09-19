"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/mock-data"

interface ProductDetailProps {
  product: Product
}

const colorMap: Record<string, string> = {
  Black: "#000000",
  White: "#FFFFFF",
  Navy: "#1e3a8a",
  Gray: "#6b7280",
  Grey: "#6b7280",
  Red: "#dc2626",
  Blue: "#2563eb",
  Green: "#16a34a",
  Pink: "#ec4899",
  Yellow: "#eab308",
  Purple: "#9333ea",
  Brown: "#a3a3a3",
  Cream: "#fef3c7",
  Burgundy: "#7c2d12",
  Gold: "#fbbf24",
  Silver: "#d1d5db",
  "Rose Gold": "#f59e0b",
  "Light Blue": "#7dd3fc",
  "Dark Blue": "#1e40af",
  Multi: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)",
  "Earth Tones": "linear-gradient(45deg, #8b4513, #daa520, #228b22)",
  Sunset: "linear-gradient(45deg, #ff6b35, #f7931e, #ffcc02)",
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)

  const { user, openLoginModal } = useAuth()
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!user) {
      openLoginModal()
      return
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select size and color")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      })
    }
  }

  const handleLike = () => {
    if (!user) {
      openLoginModal()
      return
    }
    setIsLiked(!isLiked)
  }

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "+1234567890"
    const message = `Hi! I'm interested in the ${product.name} (${product.category}) priced at $${product.salePrice || product.price}. Could you provide more information?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.salePrice && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">Sale</Badge>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold">${product.salePrice}</span>
                  <span className="text-xl text-muted-foreground line-through">${product.price}</span>
                  <Badge variant="destructive">Save ${product.price - product.salePrice}</Badge>
                </>
              ) : (
                <span className="text-3xl font-bold">${product.price}</span>
              )}
            </div>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Color</h3>
            <TooltipProvider>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <Tooltip key={color}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-primary ring-2 ring-primary/20 scale-110"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{
                          background: colorMap[color] || color.toLowerCase(),
                        }}
                      >
                        {color === "White" && <div className="absolute inset-1 rounded-full border border-gray-200" />}
                        {selectedColor === color && (
                          <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
            {selectedColor && <p className="text-sm text-muted-foreground">Selected: {selectedColor}</p>}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quantity</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button variant="outline" size="lg" onClick={handleLike}>
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleWhatsAppInquiry}
            className="w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Ask about this product on WhatsApp
          </Button>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-muted-foreground">Your payment is protected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
