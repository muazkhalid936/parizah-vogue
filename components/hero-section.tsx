import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with elegant gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/cover.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      {/* Floating elements for ambiance */}
      <div className="absolute top-20 left-10 animate-pulse">
        <Sparkles className="h-6 w-6 text-yellow-400/60" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse delay-1000">
        <Star className="h-4 w-4 text-yellow-400/40" />
      </div>
      <div className="absolute bottom-32 left-20 animate-pulse delay-2000">
        <Sparkles className="h-5 w-5 text-yellow-400/50" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in-up">
          <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
          <span className="text-white text-sm font-medium">New Collection 2025</span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-tight animate-fade-in-up delay-200">
            <span className="block">Elegance</span>
            <span className="block gradient-text font-medium">Redefined</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            Discover timeless sophistication in our curated collection of contemporary dresses
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 py-6 animate-fade-in-up delay-600">
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-white">500+</div>
            <div className="text-sm text-white/70">Exclusive Designs</div>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-white">50K+</div>
            <div className="text-sm text-white/70">Happy Customers</div>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-white">4.9★</div>
            <div className="text-sm text-white/70">Customer Rating</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-800">
          <Button 
            asChild 
            size="lg" 
            className="elegant-button text-lg px-10 py-4 h-auto group"
          >
            <Link href="/collections" className="flex items-center">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="text-lg px-10 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Link href="/new-arrivals" className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              New Arrivals
            </Link>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Side decoration */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col items-center space-y-4 text-white/60">
          <div className="writing-vertical text-sm font-light tracking-wider">PARIZAH VOGUE 2025</div>
          <div className="w-px h-20 bg-white/30"></div>
        </div>
      </div>
    </section>
  )
}
