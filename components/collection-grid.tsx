"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { mockProducts } from "@/lib/mock-data"

const collections = [
  {
    name: "Evening Elegance",
    description: "Sophisticated dresses for special occasions",
    category: "Evening",
    image: "/placeholder.svg?key=evening",
    count: mockProducts.filter((p) => p.category === "Evening").length,
  },
  {
    name: "Summer Breeze",
    description: "Light and airy dresses for warm weather",
    category: "Summer",
    image: "/placeholder.svg?key=summer",
    count: mockProducts.filter((p) => p.category === "Summer").length,
  },
  {
    name: "Professional Power",
    description: "Polished looks for the workplace",
    category: "Formal",
    image: "/placeholder.svg?key=formal",
    count: mockProducts.filter((p) => p.category === "Formal").length,
  },
  {
    name: "Casual Comfort",
    description: "Relaxed styles for everyday wear",
    category: "Casual",
    image: "/placeholder.svg?key=casual",
    count: mockProducts.filter((p) => p.category === "Casual").length,
  },
  {
    name: "Winter Warmth",
    description: "Cozy dresses for colder months",
    category: "Winter",
    image: "/placeholder.svg?key=winter",
    count: mockProducts.filter((p) => p.category === "Winter").length,
  },
]

export function CollectionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Link key={collection.category} href={`/collections/${collection.category.toLowerCase()}`}>
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${collection.image}')`,
                  backgroundColor: "#f3f4f6",
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-sm opacity-90">{collection.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{collection.category}</span>
                <Badge variant="secondary">
                  {collection.count} item{collection.count !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
