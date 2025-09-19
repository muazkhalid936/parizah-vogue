import { AdminLayout } from "@/components/admin-layout"
import { ProductManagement } from "@/components/product-management"

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  )
}
