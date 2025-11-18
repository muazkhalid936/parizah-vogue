import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Product from "@/lib/models/product"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const isNew = searchParams.get("isNew")
    const trending = searchParams.get("trending")

    let query = {}
    if (category) query = { ...query, category }
    if (featured === "true") query = { ...query, featured: true }
    if (isNew === "true") query = { ...query, isNew: true }
    if (trending === "true") query = { ...query, trending: true }

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
    const { name, description, price, category, sizes, stock, images, featured, isNew, trending } = await request.json()

    // Basic server-side validation
    const allowedCategories = ["stitched", "unstitched", "party"]
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: `Invalid category. Allowed: ${allowedCategories.join(', ')}` }, { status: 400 })
    }

    if (!Array.isArray(images) || images.length < 1 || images.length > 5) {
      return NextResponse.json({ error: 'Images must be an array with 1 to 5 items' }, { status: 400 })
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sizes,
      stock,
      images,
      featured: featured || false,
      isNew: isNew || false,
      trending: trending || false,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
