import { AdminLayout } from "@/components/admin-layout"
import { OrderManagement } from "@/components/order-management"

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrderManagement />
    </AdminLayout>
  )
}
