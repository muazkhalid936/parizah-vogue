"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    uploadFiles(files)
  }

  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    setUploadProgress(0)
    
    const uploadedUrls: string[] = []
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })

        const data = await response.json()

        if (response.ok) {
          uploadedUrls.push(data.url)
          setUploadProgress(((i + 1) / files.length) * 100)
        } else {
          toast.error(data.error || `Failed to upload ${file.name}`)
        }
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls])
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)

    // Try to delete from Cloudinary (optional - for cleanup)
    try {
      // Extract public ID from Cloudinary URL
      const urlParts = imageUrl.split('/')
      const filename = urlParts[urlParts.length - 1]
      const publicId = `parizah-vogue/products/${filename.split('.')[0]}`

      await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Error deleting image from server:', error)
      // Continue anyway since we removed it from the UI
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = Array.from(event.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length === 0) {
      toast.error('Please drop image files only')
      return
    }

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    uploadFiles(files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'border-blue-400 bg-blue-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin mx-auto h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            <p className="text-sm text-gray-600">Uploading images...</p>
            <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                Drop images here or{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP up to 5MB each (max {maxImages} images)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg'
                  }}
                />
              </div>
              
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{images.length} of {maxImages} images</span>
        {images.length > 0 && (
          <span>First image will be used as primary</span>
        )}
      </div>
    </div>
  )
}