export interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  category: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured: boolean
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Evening Gown",
    description:
      "A stunning floor-length evening gown perfect for special occasions. Features intricate beadwork and a flattering silhouette.",
    price: 299,
    salePrice: 249,
    category: "Evening",
    images: ["/placeholder-aeles.png", "/elegant-black-evening-gown-back-view.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Summer Floral Midi Dress",
    description:
      "Light and breezy midi dress with beautiful floral print. Perfect for summer outings and casual events.",
    price: 89,
    category: "Summer",
    images: ["/placeholder-zmdjd.png", "/placeholder-u8yr5.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Yellow"],
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Professional Blazer Dress",
    description: "Sophisticated blazer-style dress ideal for business meetings and professional settings.",
    price: 159,
    category: "Formal",
    images: ["/placeholder-ljgo4.png", "/placeholder-zy8vg.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy"],
    inStock: true,
    featured: false,
  },
  {
    id: "4",
    name: "Casual Denim Dress",
    description:
      "Comfortable and stylish denim dress perfect for everyday wear. Features button-front design and pockets.",
    price: 79,
    category: "Casual",
    images: ["/placeholder-4n5ky.png", "/placeholder-th2rk.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    inStock: true,
    featured: false,
  },
  {
    id: "5",
    name: "Winter Wool Sweater Dress",
    description: "Cozy wool sweater dress perfect for cold weather. Features ribbed texture and comfortable fit.",
    price: 129,
    category: "Winter",
    images: ["/placeholder-6y00r.png", "/placeholder-u6shw.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Brown"],
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Cocktail Party Dress",
    description: "Chic cocktail dress with sequin details. Perfect for parties and special celebrations.",
    price: 199,
    salePrice: 159,
    category: "Evening",
    images: ["/placeholder-feewt.png", "/placeholder-lnrdw.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gold", "Silver", "Rose Gold"],
    inStock: true,
    featured: true,
  },
  {
    id: "7",
    name: "Bohemian Maxi Dress",
    description: "Flowing bohemian-style maxi dress with intricate patterns. Perfect for festivals and casual outings.",
    price: 109,
    category: "Casual",
    images: ["/placeholder-2jycq.png", "/placeholder-yji6g.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Multi", "Earth Tones", "Sunset"],
    inStock: true,
    featured: false,
  },
  {
    id: "8",
    name: "Little Black Dress",
    description: "Classic little black dress that never goes out of style. Versatile and elegant for any occasion.",
    price: 139,
    category: "Formal",
    images: ["/placeholder-dxdm4.png", "/placeholder.svg?height=500&width=400"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black"],
    inStock: true,
    featured: true,
  },
]
