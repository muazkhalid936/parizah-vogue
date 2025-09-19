import { ProductDetail } from "@/components/product-detail"
import { CustomerLayout } from "@/components/customer-layout"
import { mockProducts } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <CustomerLayout>
      <ProductDetail product={product} />
    </CustomerLayout>
  )
}
