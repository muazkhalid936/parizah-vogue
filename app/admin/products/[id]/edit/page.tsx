"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"

const categories = ["Casual", "Formal", "Evening", "Summer", "Winter", "Accessories", "Shoes", "Bags"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const colors = ["Black", "White", "Navy", "Gray", "Red", "Blue", "Green", "Pink", "Yellow", "Purple", "Brown", "Beige"]

interface Product {
  _id: string
  name: string
  description: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand?: string
  sku: string
  stock: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  sizes: string[]
  colors: string[]
  tags: string[]
  featured: boolean
  active: boolean
  discount?: number
  rating: {
    average: number
    count: number
  }
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
    brand: "",
    sku: "",
    stock: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    tags: [] as string[],
    featured: false,
    active: true,
    discount: "",
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const product: Product = await response.json()
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || "",
          category: product.category,
          subcategory: product.subcategory || "",
          brand: product.brand || "",
          sku: product.sku,
          stock: product.stock.toString(),
          weight: product.weight?.toString() || "",
          length: product.dimensions?.length?.toString() || "",
          width: product.dimensions?.width?.toString() || "",
          height: product.dimensions?.height?.toString() || "",
          images: product.images || [],
          sizes: product.sizes || [],
          colors: product.colors || [],
          tags: product.tags || [],
          featured: product.featured,
          active: product.active,
          discount: product.discount?.toString() || "",
        })
      } else {
        toast.error('Failed to fetch product details')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to fetch product details')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.sku) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one product image')
      return
    }

    setIsLoading(true)
    
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        brand: formData.brand || undefined,
        sku: formData.sku,
        stock: parseInt(formData.stock) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: formData.length && formData.width && formData.height ? {
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height)
        } : undefined,
        images: formData.images,
        sizes: formData.sizes,
        colors: formData.colors,
        tags: formData.tags,
        featured: formData.featured,
        active: formData.active,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('An error occurred while updating the product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }))
  }

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }))
  }

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images
    }))
  }

  const addTag = () => {
    const tag = prompt("Enter a tag:")
    if (tag && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Available Sizes</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={() => handleSizeToggle(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Available Colors</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={formData.colors.includes(color)}
                        onCheckedChange={() => handleColorToggle(color)}
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Tags</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tag
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                        <span className="text-sm">{tag}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeTag(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={10}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Enter stock quantity"
                />
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="Enter subcategory"
                />
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    placeholder="Length"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder="Width"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="Height"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}