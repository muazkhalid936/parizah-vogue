'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Parizah Vogue
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600">Categories</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Search className="h-6 w-6 text-gray-700 cursor-pointer hover:text-blue-600" />
            <ShoppingCart className="h-6 w-6 text-gray-700 cursor-pointer hover:text-blue-600" />
            
            {user ? (
              <div className="relative group">
                <div className="flex items-center cursor-pointer">
                  <User className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700 hidden sm:block">{user.email}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Products</Link>
                <Link href="/categories" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Categories</Link>
                <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">About</Link>
                <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</Link>
              </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;