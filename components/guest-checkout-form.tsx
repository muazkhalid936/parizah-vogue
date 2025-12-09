import { useState } from "react"

interface GuestCheckoutFormProps {
  onSubmit: (guestInfo: GuestInfo) => void
  loading: boolean
}

export interface GuestInfo {
  name: string
  phone: string
  email: string
  address: string
}

export default function GuestCheckoutForm({ onSubmit, loading }: GuestCheckoutFormProps) {
  const [formData, setFormData] = useState<GuestInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
  })
  const [errors, setErrors] = useState<Partial<GuestInfo>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof GuestInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<GuestInfo> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.address.trim()) newErrors.address = "Delivery address is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-card border border-border rounded p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Guest Checkout</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Complete your order without creating an account
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Delivery Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.address ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter your complete delivery address"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold hover:bg-accent transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  )
}