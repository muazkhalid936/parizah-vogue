import { CustomerLayout } from "@/components/customer-layout"
import { CollectionGrid } from "@/components/collection-grid"

export default function CollectionsPage() {
  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Collections</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections of elegant dresses for every occasion
          </p>
        </div>
        <CollectionGrid />
      </div>
    </CustomerLayout>
  )
}
