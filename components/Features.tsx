'use client';

import { Shield, Truck, CreditCard, HeartHandshake, Award, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Premium materials and craftsmanship with lifetime warranty on selected items."
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary worldwide shipping on orders over $99. Fast and secure delivery."
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Your transactions are protected with bank-level encryption and fraud protection."
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description: "Our dedicated customer service team is here to help you around the clock."
    },
    {
      icon: Award,
      title: "Authenticity",
      description: "100% authentic products sourced directly from official brand partners."
    },
    {
      icon: Clock,
      title: "Easy Returns",
      description: "30-day hassle-free returns and exchanges. Your satisfaction is our priority."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose 
            <span className="text-blue-600"> Parizah Vogue</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing you with the best shopping experience through 
            exceptional service and premium quality products.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <feature.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience Excellence?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of satisfied customers who trust Parizah Vogue for their fashion needs.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Start Shopping Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;