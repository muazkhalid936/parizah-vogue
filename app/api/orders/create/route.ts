import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/order"
import { getTokenFromRequest, verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const verified = await verifyToken(token)
    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { userId, items, totalPrice, location } = await request.json()

    const order = await Order.create({
      userId,
      items,
      totalPrice,
      location,
      status: "Pending",
    })

    return NextResponse.json({ message: "Order created successfully", orderId: order._id }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
