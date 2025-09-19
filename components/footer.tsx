import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles, Heart, Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background with elegant gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-pulse">
        <Sparkles className="h-4 w-4 text-yellow-400/30" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse delay-1000">
        <Star className="h-3 w-3 text-yellow-400/20" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-black font-serif text-xl font-bold">P</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <span className="font-serif text-2xl font-medium gradient-text">Parizah Vogue</span>
                  <p className="text-xs text-gray-400 -mt-1">Elegant Fashion</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Curating timeless elegance and contemporary sophistication. Where fashion meets artistry, 
                and every piece tells a story of refined taste.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm">Follow Our Journey</h4>
              <div className="flex space-x-4">
                <Link 
                  href="#" 
                  className="group w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Facebook className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
                <Link 
                  href="#" 
                  className="group w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Instagram className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
                <Link 
                  href="#" 
                  className="group w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Twitter className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-white">Collections</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Evening Elegance", href: "/collections/evening" },
                { name: "Casual Chic", href: "/collections/casual" },
                { name: "Summer Breeze", href: "/collections/summer" },
                { name: "Winter Luxe", href: "/collections/winter" },
                { name: "Bridal Dreams", href: "/collections/bridal" },
                { name: "Accessories", href: "/collections/accessories" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-white">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Size Guide", href: "/size-guide" },
                { name: "Shipping & Returns", href: "/shipping" },
                { name: "Care Instructions", href: "/care" },
                { name: "Personal Styling", href: "/styling" },
                { name: "Gift Cards", href: "/gift-cards" },
                { name: "FAQ", href: "/faq" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-white">Stay Connected</h3>
            
            {/* Contact Info */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Fashion Avenue<br />
                  Style District, New York, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) FASHION</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300">hello@parizahvogue.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm">Join Our VIP List</h4>
              <p className="text-gray-400 text-xs">Get exclusive access to new collections and special offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium rounded-r-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 text-sm">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; 2025 Parizah Vogue. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for fashion lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
