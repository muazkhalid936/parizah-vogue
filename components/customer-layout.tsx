"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoginModal } from "@/components/login-modal"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"

interface CustomerLayoutProps {
  children: React.ReactNode
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginModal />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
