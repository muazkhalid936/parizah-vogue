"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    images: string[]
    stock: number
    active: boolean
  }
  quantity: number
  price: number
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  totalItems: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setItems([])
    }
  }, [user])

  const refreshCart = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setItems(data.cart.items || [])
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId: string, quantity: number = 1, size?: string, color?: string) => {
    if (!user) {
      throw new Error('Please login to add items to cart')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, size, color }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item to cart')
      }

      setItems(data.cart.items || [])
    } catch (error) {
      console.error('Add to cart error:', error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item from cart')
      }

      setItems(data.cart.items || [])
    } catch (error) {
      console.error('Remove from cart error:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return
    
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update cart item')
      }

      setItems(data.cart.items || [])
    } catch (error) {
      console.error('Update cart error:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear cart')
      }

      setItems([])
    } catch (error) {
      console.error('Clear cart error:', error)
      throw error
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        totalItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
