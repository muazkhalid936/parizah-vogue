"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // Ensure we have at least one image
  const displayImages = images && images.length > 0 ? images : ['/placeholder-image.jpg']

  // Thumbnails should show other images (not the currently selected one), up to 4
  const thumbnailImages = displayImages
    .map((src, idx) => ({ src, idx }))
    .filter((_, i) => i !== selectedImageIndex)
    .slice(0, 4)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={displayImages[selectedImageIndex]}
          alt={`${productName} - Main view`}
          fill
          className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnail Row (other images) */}
      {thumbnailImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {thumbnailImages.map(({ src, idx }) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`relative shrink-0 w-20 h-20 overflow-hidden rounded-md transition-all duration-200 ${
                selectedImageIndex === idx
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:opacity-75"
              }`}
            >
              <Image
                src={src}
                alt={`${productName} - View ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}