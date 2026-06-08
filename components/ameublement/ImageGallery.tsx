'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  name: string
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = () => setActive((v) => (v - 1 + images.length) % images.length)
  const next = () => setActive((v) => (v + 1) % images.length)

  return (
    <>
      {/* Main image */}
      <div className="relative overflow-hidden rounded-[20px] bg-[#f5f5f5]" style={{ aspectRatio: '4/3' }}>
        <Image
          src={images[active]}
          alt={`${name} — vue ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover transition-opacity duration-300"
        />

        {/* Overlay buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#222222] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#222222] shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#555555] shadow-md backdrop-blur-sm transition-all hover:bg-white"
          aria-label="Agrandir"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-[32px] bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                'relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-[12px] transition-all duration-150',
                active === i
                  ? 'ring-2 ring-[#B19272] ring-offset-1'
                  : 'opacity-60 hover:opacity-100',
              ].join(' ')}
              aria-label={`Voir image ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            onClick={() => setLightbox(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-[16px]"
            style={{ aspectRatio: '4/3', width: '80vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${name} — vue ${active + 1}`}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
