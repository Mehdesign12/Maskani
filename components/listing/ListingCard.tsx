import Image from 'next/image'
import { BadgeCheck, BedDouble, Heart, Ruler } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export interface ListingCardData {
  slug: string
  title: string
  city: string
  district?: string
  price: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  type: string
  transaction: 'vente' | 'location'
  imageUrl?: string
  isPremium?: boolean
  isVerified?: boolean
  agency?: string
  publishedAt?: string
}

interface ListingCardProps {
  listing: ListingCardData
  className?: string
  priority?: boolean
}

export function ListingCard({ listing, className = '', priority = false }: ListingCardProps) {
  const {
    slug,
    title,
    city,
    district,
    price,
    area,
    bedrooms,
    transaction,
    imageUrl,
    isPremium,
    isVerified,
    agency,
    publishedAt,
  } = listing

  const displayPrice = Math.round(price / 100)
  const formattedPrice = new Intl.NumberFormat('fr-MA').format(displayPrice)
  const pricePerSqm = area ? Math.round(displayPrice / area) : null

  return (
    <Link
      href={`/annonces/${slug}` as `/annonces/${string}`}
      className={`group block shrink-0 outline-none ${className}`}
    >
      <div className="relative w-full aspect-[1.05/1] overflow-hidden rounded-[20px] bg-[#dddddd] mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 46vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#dddddd]" />
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          {(isPremium || isVerified) && (
            <span
              className="inline-flex items-center gap-1 rounded-[4px] bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[#222222]"
              style={{ filter: 'drop-shadow(rgba(0,0,0,0.25) 0px 2px 6px)' }}
            >
              {isVerified && <BadgeCheck className="h-3.5 w-3.5 text-[#E05C1A]" strokeWidth={2} />}
              {isPremium ? 'Premium' : 'Vérifié'}
            </span>
          )}

          <span className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#222222] backdrop-blur-sm transition-transform duration-150 group-hover:scale-105">
            <Heart className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>

        <div className="absolute bottom-3 start-3 rounded-[32px] bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-[#222222] backdrop-blur-sm">
          {transaction === 'vente' ? 'À vendre' : 'À louer'}
        </div>
      </div>

      <div className="space-y-1 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-[14px] font-semibold leading-snug tracking-[-0.009em] text-[#222222] line-clamp-1">
            {title}
          </h3>
          {publishedAt && (
            <span className="shrink-0 text-[12px] text-[#6a6a6a]">{publishedAt}</span>
          )}
        </div>

        <p className="text-[12px] leading-snug text-[#6a6a6a] line-clamp-1">
          {district ? `${district}, ${city}` : city}
          {agency ? ` · ${agency}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#6a6a6a]">
          {area && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" strokeWidth={1.8} />
              {area} m²
            </span>
          )}
          {bedrooms && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" strokeWidth={1.8} />
              {bedrooms} ch.
            </span>
          )}
          {pricePerSqm && transaction === 'vente' && (
            <span>{new Intl.NumberFormat('fr-MA').format(pricePerSqm)} MAD/m²</span>
          )}
        </div>

        <p className="pt-0.5 text-[14px] font-bold tracking-[-0.009em] text-[#222222]">
          {formattedPrice} <span className="font-semibold">MAD</span>
          {transaction === 'location' && (
            <span className="text-[12px] font-normal text-[#6a6a6a]"> / mois</span>
          )}
        </p>
      </div>
    </Link>
  )
}
