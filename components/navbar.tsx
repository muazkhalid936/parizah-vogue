"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag, User, Heart, Star } from "lucide-react"
import { AnimatedSidebar } from "./animated-sidebar"
import { Button } from "./ui/button"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // read user from localStorage (login stores user there)
    try {
      const raw = localStorage.getItem("user")
      if (raw) setUser(JSON.parse(raw))
    } catch (err) {
      setUser(null)
    }

    // Get cart count
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
    } catch (err) {
      setCartCount(0)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <>
      <nav className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center gap-4">
              {/* Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-foreground hover:text-primary transition-colors p-2 hover:bg-muted rounded-lg"
              >
                <Menu size={20} />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PV</span>
                </div>
                <span className="text-xl font-bold text-primary hidden sm:block">
                  Parizah Vogue
                </span>
              </Link>
            </div>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/shop" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Shop
              </Link>
              <Link 
                href="/shop?featured=true" 
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <Star size={16} />
                Featured
              </Link>
              <Link 
                href="/shop?isNew=true" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                New
              </Link>
              <Link 
                href="/shop?trending=true" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Trending
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="p-2">
                <Search size={20} />
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {!user ? (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <User size={16} className="mr-2" />
                    Login
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    Hi, {user.name}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="hidden sm:flex"
                  >
                    Logout
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden text-foreground hover:text-primary transition-colors p-2"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-card">
              <div className="px-4 py-4 space-y-4">
                <Link 
                  href="/shop" 
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link 
                  href="/shop?featured=true" 
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Featured
                </Link>
                <Link 
                  href="/shop?isNew=true" 
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Collection
                </Link>
                <Link 
                  href="/shop?trending=true" 
                  className="block text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trending
                </Link>
                {!user ? (
                  <Link 
                    href="/login" 
                    className="block text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="block text-foreground hover:text-primary transition-colors font-medium text-left w-full"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Animated Sidebar */}
      <AnimatedSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
