export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export const mockOrders: Order[] = [
  {
    id: "DS-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: "1",
        name: "Elegant Evening Gown",
        price: 249,
        quantity: 1,
        size: "M",
        color: "Black",
      },
      {
        id: "2",
        name: "Summer Floral Midi Dress",
        price: 89,
        quantity: 1,
        size: "S",
        color: "Pink",
      },
    ],
    subtotal: 338,
    shipping: 0,
    tax: 27.04,
    total: 365.04,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  },
  {
    id: "DS-002",
    customer: {
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 234-5678",
    },
    items: [
      {
        id: "3",
        name: "Professional Blazer Dress",
        price: 159,
        quantity: 1,
        size: "L",
        color: "Navy",
      },
    ],
    subtotal: 159,
    shipping: 9.99,
    tax: 12.72,
    total: 181.71,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
    shippingAddress: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "United States",
    },
  },
  {
    id: "DS-003",
    customer: {
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+1 (555) 345-6789",
    },
    items: [
      {
        id: "4",
        name: "Casual Denim Dress",
        price: 79,
        quantity: 2,
        size: "M",
        color: "Light Blue",
      },
    ],
    subtotal: 158,
    shipping: 0,
    tax: 12.64,
    total: 170.64,
    status: "shipped",
    createdAt: "2024-01-17T09:15:00Z",
    shippingAddress: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
    },
  },
  {
    id: "DS-004",
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 456-7890",
    },
    items: [
      {
        id: "6",
        name: "Cocktail Party Dress",
        price: 159,
        quantity: 1,
        size: "L",
        color: "Gold",
      },
      {
        id: "8",
        name: "Little Black Dress",
        price: 139,
        quantity: 1,
        size: "M",
        color: "Black",
      },
    ],
    subtotal: 298,
    shipping: 0,
    tax: 23.84,
    total: 321.84,
    status: "pending",
    createdAt: "2024-01-18T16:45:00Z",
    shippingAddress: {
      street: "321 Elm Drive",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "United States",
    },
  },
  {
    id: "DS-005",
    customer: {
      name: "Lisa Wilson",
      email: "lisa.wilson@email.com",
      phone: "+1 (555) 567-8901",
    },
    items: [
      {
        id: "5",
        name: "Winter Wool Sweater Dress",
        price: 129,
        quantity: 1,
        size: "S",
        color: "Cream",
      },
    ],
    subtotal: 129,
    shipping: 9.99,
    tax: 10.32,
    total: 149.31,
    status: "cancelled",
    createdAt: "2024-01-19T11:30:00Z",
    shippingAddress: {
      street: "654 Maple Lane",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States",
    },
  },
  {
    id: "DS-006",
    customer: {
      name: "Rachel Green",
      email: "rachel.green@email.com",
      phone: "+1 (555) 678-9012",
    },
    items: [
      {
        id: "7",
        name: "Bohemian Maxi Dress",
        price: 109,
        quantity: 1,
        size: "M",
        color: "Multi",
      },
    ],
    subtotal: 109,
    shipping: 0,
    tax: 8.72,
    total: 117.72,
    status: "processing",
    createdAt: "2024-01-20T13:20:00Z",
    shippingAddress: {
      street: "987 Cedar Court",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "United States",
    },
  },
]
