'use client'

import Image from 'next/image'
import { MapPin, Star, Truck, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { ProduitCardData } from '@/types/produit'
import { CATEGORY_META } from '@/lib/category-meta'

export { CATEGORY_META }

interface ProduitCardProps {
  produit: ProduitCardData
  priority?: boolean
  className?: string
}

export function ProduitCard({ produit, priority = false, className = '' }: ProduitCardProps) {
  const cat = CATEGORY_META[produit.category] ?? CATEGORY_META['salon']
  const discount = produit.oldPrice
    ? Math.round((1 - produit.price / produit.oldPrice) * 100)
    : null

  return (
    <Link
      href={`/ameublement/${produit.slug}` as `/ameublement/${string}`}
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white transition-all duration-200 hover:border-[#c8c8c8] hover:shadow-[0_8px_40px_rgba(0,0,0,0.09)] ${className}`}
    >
      {/* Product image */}
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#f5f5f5]">
        <Image
          src={produit.images[0]}
          alt={produit.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Badges top-left */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {produit.isNew && (
            <span className="rounded-[8px] bg-[#222222] px-2 py-0.5 text-[11px] font-bold text-white">
              Nouveau
            </span>
          )}
          {produit.isBestSeller && !produit.isNew && (
            <span className="rounded-[8px] bg-[#B19272] px-2 py-0.5 text-[11px] font-bold text-white">
              Best-seller
            </span>
          )}
        </div>

        {/* Discount badge top-right */}
        {discount && (
          <span className="absolute right-3 top-3 rounded-[8px] bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {/* Stock badge bottom-left */}
        {!produit.inStock && (
          <span className="absolute bottom-3 left-3 rounded-[8px] bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white">
            Rupture de stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category chip */}
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-[11px] font-semibold ${cat.bg} ${cat.text}`}>
            {cat.emoji} {cat.label}
          </span>
        </div>

        {/* Product name */}
        <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.3] tracking-[-0.01em] text-[#222222] group-hover:text-[#B19272] transition-colors duration-150">
          {produit.name}
        </h3>

        {/* Brand & city */}
        <div className="mt-1.5 flex items-center gap-1 text-[12px] text-[#888888]">
          <span className="font-medium text-[#555555]">{produit.brand}</span>
          <span>·</span>
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{produit.city}</span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-semibold text-[#222222]">{produit.rating}</span>
          <span className="text-[12px] text-[#aaaaaa]">({produit.reviewCount} avis)</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-bold tracking-[-0.02em] text-[#222222]">
                {produit.price.toLocaleString('fr-MA')} MAD
              </span>
            </div>
            {produit.oldPrice && (
              <span className="text-[12px] text-[#aaaaaa] line-through">
                {produit.oldPrice.toLocaleString('fr-MA')} MAD
              </span>
            )}
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-1 text-[11px] text-[#aaaaaa]">
            <Truck className="h-3 w-3 shrink-0" />
            <span>{produit.deliveryTime}</span>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${produit.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#f5f5f5] py-2.5 text-[13px] font-semibold text-[#222222] transition-all duration-150 hover:bg-[#25D366] hover:text-white group-hover:bg-[#25D366] group-hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Contacter sur WhatsApp
        </a>
      </div>
    </Link>
  )
}
