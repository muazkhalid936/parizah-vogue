"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, X, Upload, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"

const categories = ["Casual", "Formal", "Evening", "Summer", "Winter", "Accessories", "Shoes", "Bags"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const colors = ["Black", "White", "Navy", "Gray", "Red", "Blue", "Green", "Pink", "Yellow", "Purple", "Brown", "Beige"]

export function ProductForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    sizes: [] as string[],
    colors: [] as string[],
    active: true,
    featured: false,
    images: [] as string[],
    tags: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.sku) {
        toast.error('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      if (formData.images.length === 0) {
        toast.error('Please add at least one product image')
        setIsLoading(false)
        return
      }

      // Prepare data for API
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        brand: formData.brand || undefined,
        sku: formData.sku.trim().toUpperCase(),
        stock: parseInt(formData.stock) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: formData.dimensions.length && formData.dimensions.width && formData.dimensions.height ? {
          length: parseFloat(formData.dimensions.length),
          width: parseFloat(formData.dimensions.width),
          height: parseFloat(formData.dimensions.height)
        } : undefined,
        sizes: formData.sizes,
        colors: formData.colors,
        active: formData.active,
        featured: formData.featured,
        images: formData.images,
        tags: formData.tags,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Product created successfully!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Regular Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price ($)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={formData.sizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Available Colors</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {colors.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={formData.colors.includes(color) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleColorToggle(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags (Optional)</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                          <span className="text-sm">{tag}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTag}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
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
                  <Label htmlFor="sku">SKU</Label>
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
                  <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="Enter subcategory"
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Enter brand"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg, Optional)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Enter weight"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dimensions (cm, Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.length}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, length: e.target.value }
                    })}
                    placeholder="Enter length"
                  />
                </div>

                <div>
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, width: e.target.value }
                    })}
                    placeholder="Enter width"
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      dimensions: { ...formData.dimensions, height: e.target.value }
                    })}
                    placeholder="Enter height"
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
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
                  />
                  <Label htmlFor="active">Active (Visible to customers)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
                <Button type="button" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/admin/products">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
