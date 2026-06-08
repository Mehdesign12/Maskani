import Image from 'next/image'
import { BadgeCheck, MapPin, Star, Zap } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { PresataireCardData } from '@/types/prestataire'

export const CATEGORY_META: Record<string, { bg: string; text: string; label: string }> = {
  notaire:       { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Notaire' },
  agent:         { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', label: 'Agent immobilier' },
  diagnostiqueur:{ bg: 'bg-[#EDE9FE]', text: 'text-[#5B21B6]', label: 'Diagnostiqueur' },
  architecte:    { bg: 'bg-[#E0E7FF]', text: 'text-[#3730A3]', label: 'Architecte' },
  entrepreneur:  { bg: 'bg-[#FFE4E6]', text: 'text-[#9F1239]', label: 'Entrepreneur' },
  avocat:        { bg: 'bg-[#F1F5F9]', text: 'text-[#334155]', label: 'Avocat' },
  photographe:   { bg: 'bg-[#FCE7F3]', text: 'text-[#9D174D]', label: 'Photographe' },
  demenageur:    { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', label: 'Déménageur' },
}

const AVAILABILITY_META = {
  disponible: { dot: 'bg-emerald-500', label: 'Disponible' },
  occupe:     { dot: 'bg-amber-400',   label: 'Occupé' },
  sur_rdv:    { dot: 'bg-blue-500',    label: 'Sur RDV' },
}

interface PresataireCardProps {
  prestataire: PresataireCardData
  priority?: boolean
  className?: string
}

export function PresataireCard({ prestataire, priority = false, className = '' }: PresataireCardProps) {
  const cat = CATEGORY_META[prestataire.category] ?? CATEGORY_META.agent
  const avail = AVAILABILITY_META[prestataire.availability]

  return (
    <Link
      href={`/prestataires/${prestataire.slug}` as `/prestataires/${string}`}
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white transition-all duration-200 hover:border-[#c8c8c8] hover:shadow-[0_8px_40px_rgba(0,0,0,0.09)] ${className}`}
    >
      {/* Cover image */}
      <div className="relative h-[108px] shrink-0 overflow-hidden bg-[#ebebeb]">
        <Image
          src={prestataire.coverImage}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {prestataire.isPremium && (
          <span className="absolute right-3 top-3 rounded-[4px] bg-[#B19272] px-2 py-0.5 text-[11px] font-bold tracking-wide text-white">
            Premium
          </span>
        )}
      </div>

      {/* Avatar row — overlaps cover/body boundary */}
      <div className="relative px-5">
        <div className="flex items-end justify-between" style={{ marginTop: '-28px' }}>
          {/* Avatar */}
          <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-sm">
            <Image
              src={prestataire.avatar}
              alt={prestataire.name}
              fill
              sizes="56px"
              className="object-cover"
            />
            {prestataire.isVerified && (
              <div className="absolute bottom-0 right-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5 text-[#B19272]" fill="currentColor" />
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1.5 pb-1">
            <div className={`h-2 w-2 shrink-0 rounded-full ${avail.dot}`} />
            <span className="text-[11px] font-medium text-[#6a6a6a]">{avail.label}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Category + name */}
        <div className="mb-3">
          <span className={`mb-2 inline-flex items-center rounded-[32px] px-2.5 py-0.5 text-[11px] font-semibold ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
          <h3 className="mt-1.5 text-[15px] font-bold leading-[1.2] tracking-[-0.01em] text-[#222222]">
            {prestataire.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-[#6a6a6a]">{prestataire.title}</p>
        </div>

        {/* Rating + city */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-bold text-[#222222]">{prestataire.rating.toFixed(1)}</span>
            <span className="text-[#6a6a6a]">· {prestataire.reviewCount} avis</span>
          </div>
          <div className="flex items-center gap-1 text-[#6a6a6a]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{prestataire.district ? `${prestataire.district}, ` : ''}{prestataire.city}</span>
          </div>
        </div>

        {/* Service tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {prestataire.services.slice(0, 3).map((s) => (
            <span key={s} className="rounded-[32px] bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-medium text-[#555555]">
              {s}
            </span>
          ))}
          {prestataire.services.length > 3 && (
            <span className="rounded-[32px] bg-[#f7f7f7] px-2.5 py-1 text-[11px] font-medium text-[#888888]">
              +{prestataire.services.length - 3}
            </span>
          )}
        </div>

        {/* Footer: price + response + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-3.5">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{prestataire.priceInfo}</p>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6a6a6a]">
              <Zap className="h-3 w-3 shrink-0" />
              <span className="truncate">{prestataire.responseTime}</span>
            </div>
          </div>
          <div className="shrink-0 rounded-[8px] bg-[#222222] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors duration-150 group-hover:bg-[#B19272]">
            Voir →
          </div>
        </div>
      </div>
    </Link>
  )
}
