"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingBag, User, Heart, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useMobile } from "@/hooks/use-mobile"
import { CartDrawer } from "@/components/cart-drawer"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, logout, openLoginModal } = useAuth()
  const { items } = useCart()
  const isMobile = useMobile()

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/sale", label: "Sale", isSpecial: true },
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-black/5 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-black/5">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl">
                <div className="mt-8 space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-serif gradient-text font-medium">Parizah Vogue</h2>
                    <p className="text-sm text-muted-foreground mt-1">Elegant Fashion Collection</p>
                  </div>
                  <nav className="flex flex-col space-y-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-lg font-medium transition-all duration-300 hover:translate-x-2 ${
                          link.isSpecial 
                            ? 'gradient-text font-semibold' 
                            : 'text-gray-800 hover:text-black'
                        }`}
                      >
                        {link.label}
                        {link.isSpecial && <Sparkles className="inline h-4 w-4 ml-2" />}
                      </Link>
                    ))}
                  </nav>
                  
                  {user && (
                    <div className="pt-6 border-t border-black/10 space-y-4">
                      <Link href="/profile" className="flex items-center text-gray-700 hover:text-black transition-colors">
                        <User className="h-5 w-5 mr-3" />
                        My Account
                      </Link>
                      <Link href="/wishlist" className="flex items-center text-gray-700 hover:text-black transition-colors">
                        <Heart className="h-5 w-5 mr-3" />
                        Wishlist
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-serif text-xl font-bold">P</span>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-2xl font-medium gradient-text">Parizah Vogue</span>
              <p className="text-xs text-muted-foreground -mt-1">Elegant Fashion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                    link.isSpecial 
                      ? 'gradient-text font-semibold text-base' 
                      : 'text-gray-700 hover:text-black text-sm'
                  } group`}
                >
                  {link.label}
                  {link.isSpecial && <Sparkles className="inline h-4 w-4 ml-1" />}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-black/5 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            {user && (
              <Button variant="ghost" size="icon" className="hover:bg-black/5 transition-colors">
                <Heart className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-black/5 transition-colors" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 font-semibold">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="hover:bg-black/5">
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="hidden sm:flex border-black/20 hover:border-black/40 hover:bg-black/5"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button 
                  className="elegant-button text-sm px-6"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-6 pt-2 animate-fade-in-up">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for elegant dresses, accessories..."
                className="w-full pl-12 pr-6 py-4 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 bg-white/80 backdrop-blur-sm text-lg font-medium placeholder:text-gray-400 transition-all"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border text-gray-500">⌘K</kbd>
              </div>
            </div>
          </div>
        )}

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </header>
  )
}
