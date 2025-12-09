"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  initialIndex: number
  productName: string
  video?: string
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex,
  productName,
  video,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Combine images and video into media array
  const mediaItems = []
  if (video) {
    mediaItems.push({ type: 'video', src: video })
  }
  images.forEach(img => mediaItems.push({ type: 'image', src: img }))

  const totalItems = mediaItems.length

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems)
  }, [totalItems])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems)
  }, [totalItems])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Update currentIndex when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  if (!isOpen || totalItems === 0) return null

  const currentMedia = mediaItems[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Close image viewer"
      >
        <X size={24} />
      </button>

      {/* Navigation arrows */}
      {totalItems > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Main content */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
          {currentMedia.type === 'video' ? (
            <video
              src={currentMedia.src}
              controls
              className="max-w-full max-h-full object-contain"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentMedia.src}
                alt={`${productName} - View ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>
          )}
        </div>
      </div>

      {/* Image counter */}
      {totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
          {currentIndex + 1} / {totalItems}
        </div>
      )}

      {/* Thumbnail navigation */}
      {totalItems > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-xs overflow-x-auto px-4">
          {mediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}