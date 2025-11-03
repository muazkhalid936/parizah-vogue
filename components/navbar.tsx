"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    // read user from localStorage (login stores user there)
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
    router.push("/")
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Parizah Vogue</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-foreground hover:text-primary transition">
            Shop
          </Link>
          {!user ? (
            <Link href="/login" className="text-foreground hover:text-primary transition">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="text-foreground hover:text-primary transition">
              Logout
            </button>
          )}
          <Link href="/cart" className="text-foreground hover:text-primary transition">
            Cart
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-4">
            <Link href="/shop" className="text-foreground hover:text-primary transition">
              Shop
            </Link>
            {!user ? (
              <Link href="/login" className="text-foreground hover:text-primary transition">
                Login
              </Link>
            ) : (
              <button onClick={handleLogout} className="text-foreground hover:text-primary transition text-left">
                Logout
              </button>
            )}
            <Link href="/cart" className="text-foreground hover:text-primary transition">
              Cart
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
