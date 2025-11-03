import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Product from "@/lib/models/product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let query = {}
    if (category) query = { ...query, category }
    if (featured === "true") query = { ...query, featured: true }

    const products = await Product.find(query).limit(50)
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, description, price, category, sizes, stock, images, featured } = await request.json()

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sizes,
      stock,
      images,
      featured: featured || false,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
