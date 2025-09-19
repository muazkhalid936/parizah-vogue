"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, User, Sparkles, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth()
  const isMobile = useMobile()

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-black/5 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="hover:bg-black/5">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-serif text-lg font-bold">P</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-1.5 w-1.5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl font-medium gradient-text">Admin Dashboard</h1>
                <p className="text-xs text-gray-500 -mt-1">Parizah Vogue Management</p>
              </div>
            </div>
            
            {/* View Store Link */}
            <Link 
              href="/" 
              className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Store className="h-4 w-4" />
              <span>View Store</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-black/5 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-black" />
            </div>
            
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role?.toUpperCase()} • {user?.email}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="elegant-button text-sm px-4 py-2 h-8"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
