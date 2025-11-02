'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, CreditCard, Truck } from 'lucide-react';

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Mock cart items - In a real app, this would come from context/state
    {
      product: '6547a8b9c1234567890abcde',
      name: 'Summer Dress',
      image: '/placeholder-product.svg',
      price: 89.99,
      quantity: 1
    },
    {
      product: '6547a8b9c1234567890abcdf',
      name: 'Designer Handbag',
      image: '/placeholder-product.svg', 
      price: 149.99,
      quantity: 1
    }
  ]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'USA',
    phone: ''
  });

  const itemsPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Math.round((itemsPrice * 0.1) * 100) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod: 'COD'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order placed successfully! Our team will contact you soon to confirm your order.');
        router.push(`/orders/${data.orderId}`);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-4">You need to login to place an order.</p>
          <button
            onClick={() => router.push('/login?redirect=/checkout')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Method */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="flex items-center p-4 border border-gray-300 rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Cash on Delivery (COD)</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Items ({cartItems.length}):</span>
                <span>{formatPrice(itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900">Free shipping on orders over $100</div>
                  <div className="text-blue-700">Estimated delivery: 3-5 business days</div>
                </div>
              </div>
            </div>

            {/* Order Process Info */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-yellow-900 mb-2">Order Process:</div>
                <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                  <li>Your order will be reviewed by our team</li>
                  <li>We'll contact you to confirm details</li>
                  <li>Order will be processed and shipped</li>
                  <li>You'll receive tracking information</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}