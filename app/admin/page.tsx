"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== "admin") {
      router.push("/")
      return
    }

    setUser(userData)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-secondary text-secondary-foreground p-6 min-h-screen">
          <h1 className="text-2xl font-bold mb-8 text-primary">Parizah Admin</h1>

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full text-left px-4 py-3 rounded transition ${
                activeTab === "products" ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-4 py-3 rounded transition ${
                activeTab === "orders" ? "bg-primary text-primary-foreground" : "hover:bg-secondary-foreground/10"
              }`}
            >
              Orders
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "orders" && <AdminOrders />}
        </div>
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "casual",
    stock: "",
    images: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = formData.images
      
      // Upload image to Cloudinary if a file is selected
      if (selectedFile) {
        console.log("Uploading file to Cloudinary:", selectedFile.name)
        try {
          imageUrl = await uploadToCloudinary(selectedFile)
          console.log("Upload successful, URL:", imageUrl)
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError)
          alert(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`)
          setUploading(false)
          return
        }
      }

      const endpoint = editingId ? `/api/products/${editingId}` : "/api/products"
      const method = editingId ? "PUT" : "POST"
      const token = localStorage.getItem("token")

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          stock: Number.parseInt(formData.stock),
          images: [imageUrl || "/placeholder.svg?key=dress1"],
        }),
      })

      if (response.ok) {
        alert(editingId ? "Product updated!" : "Product created!")
        setFormData({ name: "", description: "", price: "", category: "casual", stock: "", images: "" })
        setSelectedFile(null)
        setEditingId(null)
        setShowForm(false)
        fetchProducts()
      } else {
        const errorData = await response.json()
        alert(`Error saving product: ${errorData.message || 'Unknown error'}`)
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      alert(`Error saving product: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images?.[0] || "",
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        alert("Product deleted!")
        fetchProducts()
      }
    } catch (err) {
      alert("Error deleting product")
    }
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Products</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setSelectedFile(null)
            setFormData({ name: "", description: "", price: "", category: "casual", stock: "", images: "" })
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-accent transition"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-2 border border-border rounded bg-input"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="px-4 py-2 border border-border rounded bg-input"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="px-4 py-2 border border-border rounded bg-input"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="px-4 py-2 border border-border rounded bg-input"
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="party">Party</option>
            </select>
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border rounded bg-input mb-4"
            rows={3}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-border rounded bg-input"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-2">Selected: {selectedFile.name}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-accent transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-card border border-border rounded p-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="font-medium">${product.price}</span>
                <span className="text-muted-foreground">Stock: {product.stock}</span>
                <span className="text-muted-foreground capitalize">{product.category}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        alert("Order status updated!")
        fetchOrders()
      }
    } catch (err) {
      alert("Error updating order")
    }
  }

  if (loading) return <div>Loading orders...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Orders</h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-card border border-border rounded p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold text-sm truncate">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{order.userId?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-sm">{order.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1 rounded font-medium text-sm ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Delivered</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Items:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
