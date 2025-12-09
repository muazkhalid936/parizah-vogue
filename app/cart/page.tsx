"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GuestCheckoutForm, { type GuestInfo } from "@/components/guest-checkout-form"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  selectedSize: string
  quantity: number
}

export default function Cart() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [isGuestCheckout, setIsGuestCheckout] = useState(false)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(savedCart)
    
    // Check if user is logged in
    try {
      const userData = localStorage.getItem("user")
      const token = localStorage.getItem("token")
      if (userData && token) {
        setUser(JSON.parse(userData))
      }
    } catch (err) {
      setUser(null)
    }
  }, [])

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleUserCheckout = async () => {
    if (!location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a delivery location",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          totalPrice: total,
          location: location || user.location,
        }),
      })

      if (response.ok) {
        localStorage.setItem("cart", "[]")
        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully!",
        })
        router.push("/orders")
      } else {
        const errorData = await response.json()
        toast({
          title: "Order Failed",
          description: errorData.error || "Failed to place order",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while placing your order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGuestCheckout = async (guestInfo: GuestInfo) => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestInfo,
          items: cart,
          totalPrice: total,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("cart", "[]")
        toast({
          title: "Order Placed Successfully!",
          description: `Your order number is #${data.orderNumber}. We'll contact you at the provided phone number for delivery updates.`,
        })
        router.push("/shop")
      } else {
        const errorData = await response.json()
        toast({
          title: "Order Failed",
          description: errorData.error || "Failed to place order",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while placing your order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded hover:bg-accent transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-card border border-border rounded p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Size: {item.selectedSize}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary mb-4">৳{(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-card border border-border rounded p-6 sticky top-20 mb-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Options */}
            {user ? (
              /* Logged-in User Checkout */
              <div className="bg-card border border-border rounded p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Checkout</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Welcome back, {user.name}!
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Delivery Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={user.location || "Enter delivery address"}
                  />
                </div>

                <button
                  onClick={handleUserCheckout}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-accent transition disabled:opacity-50 mb-4"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            ) : (
              /* Guest Checkout Options */
              <div>
                {!isGuestCheckout ? (
                  <div className="bg-card border border-border rounded p-6 mb-6">
                    <h2 className="text-xl font-bold mb-6">Checkout Options</h2>
                    
                    <div className="space-y-4">
                      <Link
                        href="/login"
                        className="block w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-accent transition text-center"
                      >
                        Login to Checkout
                      </Link>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        or
                      </div>
                      
                      <button
                        onClick={() => setIsGuestCheckout(true)}
                        className="w-full py-3 border border-border rounded hover:bg-muted transition font-medium"
                      >
                        Continue as Guest
                      </button>
                      
                      <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded">
                        💡 Your cart is saved locally on this device and will persist until you complete your order or clear your browser data.
                      </div>
                    </div>
                  </div>
                ) : (
                  <GuestCheckoutForm onSubmit={handleGuestCheckout} loading={loading} />
                )}
                
                {isGuestCheckout && (
                  <button
                    onClick={() => setIsGuestCheckout(false)}
                    className="text-primary hover:text-accent text-sm font-medium mb-4"
                  >
                    ← Back to checkout options
                  </button>
                )}
              </div>
            )}

            <Link
              href="/shop"
              className="block w-full text-center py-3 border border-border rounded hover:bg-muted transition text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
