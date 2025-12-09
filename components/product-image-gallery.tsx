"use client"

import { useState } from "react"
import Image from "next/image"
import ImageViewerModal from "@/components/image-viewer-modal"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  video?: string
}

export default function ProductImageGallery({ images, productName, video }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  
  // Combine images and video into a media array
  const mediaItems = []
  if (video) {
    mediaItems.push({ type: 'video', src: video })
  }
  images.forEach(img => mediaItems.push({ type: 'image', src: img }))
  
  // Ensure we have at least one media item
  const displayMedia = mediaItems.length > 0 ? mediaItems : [{ type: 'image', src: '/placeholder-image.jpg' }]

  // Thumbnails should show other media (not the currently selected one), up to 4
  const thumbnailMedia = displayMedia
    .map((item, idx) => ({ ...item, idx }))
    .filter((_, i) => i !== selectedImageIndex)
    .slice(0, 4)

  const selectedMedia = displayMedia[selectedImageIndex]

  return (
    <div className="space-y-4">
      {/* Main Media */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-muted cursor-pointer group" onClick={openModal}>
        {selectedMedia.type === 'video' ? (
          <video
            src={selectedMedia.src}
            controls
            className="w-full h-full object-cover"
            poster={images[0]} // Use first image as poster if available
            onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking video controls
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <Image
              src={selectedMedia.src}
              alt={`${productName} - Main view`}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              priority
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                Click to view full size
              </div>
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Row (other media) */}
      {thumbnailMedia.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {thumbnailMedia.map(({ type, src, idx }) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              aria-label={`View ${type} ${idx + 1}`}
              className={`relative shrink-0 w-20 h-20 overflow-hidden rounded-md transition-all duration-200 ${
                selectedImageIndex === idx
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:opacity-75"
              }`}
            >
              {type === 'video' ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              ) : (
                <Image
                  src={src}
                  alt={`${productName} - View ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Full-screen Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        initialIndex={selectedImageIndex}
        productName={productName}
        video={video}
      />
    </div>
  )
}