import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Parizah Vogue</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for the latest fashion trends and premium quality clothing.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-purple-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-purple-400">Home</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-purple-400">Products</Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-purple-400">Categories</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-purple-400">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-purple-400">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-gray-300 hover:text-purple-400">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-purple-400">Returns</Link></li>
              <li><Link href="/size-guide" className="text-gray-300 hover:text-purple-400">Size Guide</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-purple-400">FAQ</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-purple-400">Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-gray-300">info@parizahvogue.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-400 mr-3" />
                <span className="text-gray-300">123 Fashion St, NYC, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Parizah Vogue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;