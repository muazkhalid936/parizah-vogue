"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, ShoppingBag, Eye, Star, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
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
};

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user, openLoginModal } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!user) {
      openLoginModal();
      return;
    }

    addItem(product.id);
  };

  const handleLike = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    setIsLiked(!isLiked);
  };

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 bg-transparent shadow-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="aspect-[3/4] relative">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.salePrice && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-semibold px-3 py-1">
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 font-semibold px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute top-4 right-4 flex flex-col gap-3 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <Button
              size="icon"
              className={`h-10 w-10 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                isLiked
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/90 hover:bg-white text-gray-700 hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg backdrop-blur-sm"
              asChild
            >
              <Link href={`/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Add Button */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              className="w-full elegant-button rounded-xl h-12 font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="pt-6 space-y-3">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              {"Parizah Vogue"}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-xs text-gray-500">(124)</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-serif text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="font-bold text-xl text-gray-900">
                  ${product.salePrice}
                </span>
                <span className="text-gray-500 line-through font-medium">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="font-bold text-xl text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center justify-between pt-2">
            <TooltipProvider>
              <div className="flex gap-2">
                {product.colors.slice(0, 5).map((color, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-all duration-200 ring-1 ring-gray-200"
                        style={{
                          background: colorMap[color] || color.toLowerCase(),
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{color}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {product.colors.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{product.colors.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </TooltipProvider>

            {/* Sizes */}
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map((size, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-md font-medium text-gray-700"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
