"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/mock-data"

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { user, openLoginModal } = useAuth()
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!user) {
      openLoginModal()
      return
    }

    // Add with default size and color - in real app, this would open a variant selector
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0],
      color: product.colors[0],
    })
  }

  const handleLike = () => {
    if (!user) {
      openLoginModal()
      return
    }
    setIsLiked(!isLiked)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Sale Badge */}
          {product.salePrice && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">Sale</Badge>
          )}

          {/* Action Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Add Button */}
          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <Button className="w-full" size="sm" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          </Link>

          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-lg">${product.salePrice}</span>
                  <span className="text-muted-foreground line-through">${product.price}</span>
                </>
              ) : (
                <span className="font-bold text-lg">${product.price}</span>
              )}
            </div>

            <TooltipProvider>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-5 h-5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          background: colorMap[color] || color.toLowerCase(),
                        }}
                      >
                        {color === "White" && <div className="w-full h-full rounded-full border border-gray-200" />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground self-center ml-1">+{product.colors.length - 4}</span>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
