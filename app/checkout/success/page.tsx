import { CustomerLayout } from "@/components/customer-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  // In a real app, you'd get the order details from the URL params or API
  const orderNumber = "DS-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Order #{orderNumber}</h2>
                <p className="text-muted-foreground">A confirmation email has been sent to your email address.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <Package className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Processing</h3>
                  <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                </div>
                <div className="space-y-2">
                  <Truck className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Shipping</h3>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
                <div className="space-y-2">
                  <Mail className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Updates</h3>
                  <p className="text-sm text-muted-foreground">Track via email notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
