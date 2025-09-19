import { CustomerLayout } from "@/components/customer-layout"
import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <CustomerLayout>
      <HeroSection />
      <ProductGrid />
    </CustomerLayout>
  )
}
