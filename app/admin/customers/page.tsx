import { AdminLayout } from "@/components/admin-layout"
import { CustomerManagement } from "@/components/customer-management"

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <CustomerManagement />
    </AdminLayout>
  )
}
