import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export interface ListingCardData {
  slug: string
  title: string
  city: string
  district?: string
  price: number
  area?: number
  bedrooms?: number
  type: string
  transaction: 'vente' | 'location'
  imageUrl?: string
  isPremium?: boolean
  isVerified?: boolean
}

interface ListingCardProps {
  listing: ListingCardData
  className?: string
}

export function ListingCard({ listing, className = '' }: ListingCardProps) {
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
  } = listing

  const formattedPrice = new Intl.NumberFormat('fr-MA').format(
    Math.round(price / 100)
  )

  return (
    <Link
      href={`/annonces/${slug}` as `/annonces/${string}`}
      className={`group block shrink-0 ${className}`}
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-[20px] bg-[#dddddd] mb-3">
        {/* Badge */}
        {(isPremium || isVerified) && (
          <span
            className={`absolute top-3 start-3 z-10 px-2.5 py-1 bg-white rounded-[4px] text-[11px] font-semibold tracking-[0.04em] ${
              isPremium ? 'text-[#222222]' : 'text-[#E05C1A]'
            }`}
            style={{ filter: 'drop-shadow(rgba(0,0,0,0.25) 0px 2px 6px)' }}
          >
            {isPremium ? 'Premium' : 'Vérifié ✓'}
          </span>
        )}

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8d5c4] to-[#b89878]" />
        )}
      </div>

      {/* Info */}
      <div className="space-y-0.5 px-0.5">
        <h3 className="text-[14px] font-semibold text-[#222222] leading-snug line-clamp-1">
          {title}
        </h3>

        <p className="text-[12px] text-[#6a6a6a]">
          {district ? `${district}, ${city}` : city}
        </p>

        {(area || bedrooms) && (
          <p className="text-[12px] text-[#6a6a6a]">
            {[area && `${area} m²`, bedrooms && `${bedrooms} ch.`]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        <p className="text-[14px] font-bold text-[#222222] pt-0.5">
          {formattedPrice}{' '}
          <span className="font-semibold">MAD</span>
          {transaction === 'location' && (
            <span className="text-[12px] font-normal text-[#6a6a6a]">
              {' '}
              / mois
            </span>
          )}
        </p>
      </div>
    </Link>
  )
}
