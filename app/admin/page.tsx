"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, X, Menu, LogOut, Package, ShoppingCart, Image as ImageIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">Parizah Admin</h1>
      </div>

      <nav className="flex-1 p-6">
        <div className="space-y-2">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("products")
              setSidebarOpen(false)
            }}
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab("orders")
              setSidebarOpen(false)
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
        </div>
      </nav>

      <div className="p-6 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-card border-r">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="lg:hidden">
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <h1 className="text-xl font-bold text-primary">Parizah Admin</h1>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </div>
          </div>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <AdminProducts />
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <AdminOrders />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function AdminProducts() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "unstitched",
    stock: "",
    featured: false,
    isNew: false,
    trending: false,
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      })
      return
    }
    setSelectedFiles(files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedVideo(file)
    }
  }

  const removeVideo = () => {
    setSelectedVideo(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.stock) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (selectedFiles.length === 0 && !editingId) {
      toast({
        title: "Validation Error",
        description: "Please select at least one image",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      let imageUrls: string[] = []
      let videoUrl: string | undefined = undefined
      
      // Upload images to Cloudinary if files are selected
      if (selectedFiles.length > 0) {
        toast({
          title: "Uploading images...",
          description: `Uploading ${selectedFiles.length} image(s)`,
        })

        const uploadPromises = selectedFiles.map(file => uploadToCloudinary(file))
        imageUrls = await Promise.all(uploadPromises)
      }

      // Upload video to Cloudinary if selected
      if (selectedVideo) {
        toast({
          title: "Uploading video...",
          description: "Uploading video file",
        })

        videoUrl = await uploadToCloudinary(selectedVideo, 'video')
      }

      const endpoint = editingId ? `/api/products/${editingId}` : "/api/products"
      const method = editingId ? "PUT" : "POST"
      const token = localStorage.getItem("token")

      const payload: any = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
      }

      // Only update images if new ones were uploaded
      if (imageUrls.length > 0) {
        payload.images = imageUrls
      }

      // Only update video if a new one was uploaded
      if (videoUrl) {
        payload.video = videoUrl
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingId ? "Product updated successfully!" : "Product created successfully!",
        })
        resetForm()
        fetchProducts()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "unstitched", stock: "", featured: false, isNew: false, trending: false })
    setSelectedFiles([])
    setSelectedVideo(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured || false,
      isNew: product.isNew || false,
      trending: product.trending || false,
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        })
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update product details" : "Fill in the product information"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price *</label>
                  <Input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock *</label>
                  <Input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stitched">Stitched</SelectItem>
                      <SelectItem value="unstitched">Unstitched</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  name="description"
                  placeholder="Product description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Product Tags</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">New Collection</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="trending"
                      checked={formData.trending}
                      onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Trending</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Images (1-5 images)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-center"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary hover:underline">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB each</div>
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-center mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Video (optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-center"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary hover:underline">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground">MP4, MOV, AVI up to 100MB</div>
                  </label>
                </div>
                
                {selectedVideo && (
                  <div className="relative group mt-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Video selected</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={removeVideo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-center mt-1 truncate">{selectedVideo.name}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      {selectedFiles.length > 0 ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    editingId ? "Update Product" : "Create Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first product</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full lg:w-24 h-24 bg-muted rounded-lg shrink-0">
                    {product.images && product.images[0] ? (
                      <div
                        className="w-full h-full rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url('${product.images[0]}')` }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="secondary" className="font-medium">
                        ${product.price}
                      </Badge>
                      <Badge variant="outline">
                        Stock: {product.stock}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                      {product.images && (
                        <Badge variant="outline">
                          {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      {product.video && (
                        <Badge variant="outline">
                          Video
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminOrders() {
  const { toast } = useToast()
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
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
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
        toast({
          title: "Success",
          description: "Order status updated successfully!",
        })
        fetchOrders()
      } else {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Orders</h2>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">Orders will appear here when customers make purchases</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order._id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-mono">#{order._id.slice(-8)}</CardTitle>
                    <CardDescription>
                      {order.isGuest 
                        ? `${order.guestInfo?.name || "Guest"} (Guest)`
                        : order.userId?.name || "Unknown Customer"
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </Badge>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {order.isGuest ? "Customer Info" : "Location"}
                    </p>
                    {order.isGuest ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {order.guestInfo?.name}</p>
                        <p><strong>Phone:</strong> {order.guestInfo?.phone}</p>
                        <p><strong>Email:</strong> {order.guestInfo?.email}</p>
                        <p><strong>Address:</strong> {order.guestInfo?.address}</p>
                      </div>
                    ) : (
                      <p className="text-sm">{order.location}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
