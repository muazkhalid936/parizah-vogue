import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Order from "@/lib/models/order"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { guestInfo, items, totalPrice } = await request.json()

    // Validate required fields
    if (!guestInfo || !guestInfo.name || !guestInfo.phone || !guestInfo.email || !guestInfo.address) {
      return NextResponse.json({ error: "Guest information is required" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 })
    }

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json({ error: "Total price must be greater than 0" }, { status: 400 })
    }

    const order = await Order.create({
      guestInfo: {
        name: guestInfo.name,
        phone: guestInfo.phone,
        email: guestInfo.email,
        address: guestInfo.address,
      },
      items,
      totalPrice,
      location: guestInfo.address,
      isGuest: true,
      status: "Pending",
    })

    return NextResponse.json({ 
      message: "Order created successfully", 
      orderId: order._id.toString(),
      orderNumber: order._id.toString().slice(-8).toUpperCase()
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating guest order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}