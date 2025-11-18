"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Menu, ShoppingBag, User, LogOut, Home } from "lucide-react"

interface AnimatedSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AnimatedSidebar({ isOpen, onClose }: AnimatedSidebarProps) {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      if (raw) setUser(JSON.parse(raw))
    } catch (err) {
      setUser(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    onClose()
    window.location.href = "/"
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
              <span className="text-xl font-bold text-primary">Parizah Vogue</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={onClose}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>

              <Link
                href="/shop"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={onClose}
              >
                <ShoppingBag size={20} />
                <span>Shop</span>
              </Link>

              {/* Category Links */}
              <div className="ml-6 space-y-2">
                <Link
                  href="/shop?category=stitched"
                  className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
                >
                  Stitched
                </Link>
                <Link
                  href="/shop?category=unstitched"
                  className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
                >
                  Unstitched
                </Link>
                <Link
                  href="/shop?category=party"
                  className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
                >
                  Party
                </Link>
              </div>

              <Link
                href="/cart"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={onClose}
              >
                <ShoppingBag size={20} />
                <span>Cart</span>
              </Link>

              {!user ? (
                <Link
                  href="/login"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={onClose}
                >
                  <User size={20} />
                  <span>Login</span>
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </nav>

          {/* User Info */}
          {user && (
            <div className="p-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}