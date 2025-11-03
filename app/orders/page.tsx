"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Order {
  _id: string
  totalPrice: number
  status: string
  location: string
  createdAt: string
  items: Array<{ name: string; quantity: number; price: number }>
}

export default function Orders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold">My Orders</h1>
          <Link href="/shop" className="text-primary hover:text-accent">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded p-12 text-center">
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-accent transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-card border border-border rounded p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="font-semibold text-sm truncate">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p
                      className={`font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Confirmed"
                            ? "text-blue-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Delivery to: {order.location}</p>
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Items: {order.items.length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
