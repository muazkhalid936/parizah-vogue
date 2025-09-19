import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-muted/50 to-muted/30">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: "url('/cover.jpg')",
        }}
      />
      <div className="relative z-10 text-center space-y-6 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Elegant Dresses for Every Occasion
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-pretty animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Discover our curated collection of sophisticated dresses that blend timeless elegance with contemporary style
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/collections">Shop Collection</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
            <Link href="/new-arrivals">New Arrivals</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
