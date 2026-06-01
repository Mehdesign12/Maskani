import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  Compass,
  Eye,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { ListingCard } from '@/components/listing/ListingCard'
import { Footer } from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'
import { Link } from '@/i18n/navigation'
import { FEATURED_LISTINGS, getListingBySlug } from '@/lib/listings'

interface ListingPageProps {
  params: {
    locale: string
    slug: string
  }
}

export function generateStaticParams() {
  return FEATURED_LISTINGS.map((listing) => ({ slug: listing.slug }))
}

export function generateMetadata({ params }: ListingPageProps): Metadata {
  const listing = getListingBySlug(params.slug)

  if (!listing) {
    return {
      title: 'Annonce introuvable | Maskani',
    }
  }

  return {
    title: `${listing.title} à ${listing.city} | Maskani`,
    description: listing.description,
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-MA').format(Math.round(price / 100))
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-MA').format(value)
}

export default function ListingDetailPage({ params }: ListingPageProps) {
  setRequestLocale(params.locale)

  const listing = getListingBySlug(params.slug)

  if (!listing) notFound()

  const displayPrice = Math.round(listing.price / 100)
  const pricePerSqm = listing.area ? Math.round(displayPrice / listing.area) : null
  const relatedListings = FEATURED_LISTINGS.filter((item) => item.slug !== listing.slug).slice(0, 4)

  const facts = [
    { icon: Ruler, label: 'Surface', value: `${listing.area} m²` },
    { icon: BedDouble, label: 'Chambres', value: `${listing.bedrooms} ch.` },
    { icon: Bath, label: 'Salles de bain', value: `${listing.bathrooms} sdb` },
    { icon: Building2, label: 'Étage', value: listing.floor ?? '—' },
    { icon: CalendarDays, label: 'Année', value: listing.yearBuilt?.toString() ?? '—' },
    { icon: Compass, label: 'Orientation', value: listing.orientation ?? '—' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#222222]">
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-[1760px] px-6 pb-8 pt-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[32px] px-3 py-2 text-[13px] font-semibold text-[#222222] transition-colors hover:bg-[#f7f7f7]"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                Retour
              </Link>

              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-2 text-[13px] font-semibold transition-colors hover:border-[#222222]">
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
                <button className="inline-flex items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-2 text-[13px] font-semibold transition-colors hover:border-[#222222]">
                  <Heart className="h-4 w-4" />
                  Sauvegarder
                </button>
              </div>
            </div>

            <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-[32px] bg-[#222222] px-3 py-1.5 text-[12px] font-semibold text-white">
                    {listing.transaction === 'vente' ? 'À vendre' : 'À louer'}
                  </span>
                  {listing.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-[32px] border border-[#ebebeb] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#222222]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#E05C1A]" />
                      Annonce vérifiée
                    </span>
                  )}
                  {listing.isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-[32px] border border-[#F4C5AE] bg-[#FFF4EF] px-3 py-1.5 text-[12px] font-semibold text-[#E05C1A]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Premium
                    </span>
                  )}
                </div>

                <h1 className="max-w-4xl text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-[#222222] sm:text-[48px]">
                  {listing.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#6a6a6a]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" strokeWidth={1.8} />
                    {listing.address}
                  </span>
                  <span>Réf. {listing.reference}</span>
                </div>
              </div>

              <div className="lg:text-end">
                <p className="text-[32px] font-bold tracking-[-0.03em] text-[#222222]">
                  {formatPrice(listing.price)} MAD
                  {listing.transaction === 'location' && (
                    <span className="text-[14px] font-normal text-[#6a6a6a]"> / mois</span>
                  )}
                </p>
                {pricePerSqm && listing.transaction === 'vente' && (
                  <p className="mt-1 text-[13px] font-medium text-[#6a6a6a]">
                    {formatNumber(pricePerSqm)} MAD / m²
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2 overflow-hidden rounded-[20px] sm:grid-cols-4 sm:grid-rows-2">
              <div className="relative min-h-[320px] bg-[#dddddd] sm:col-span-2 sm:row-span-2 sm:min-h-[520px]">
                <Image
                  src={listing.gallery[0]}
                  alt={listing.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {listing.gallery.slice(1, 5).map((image, index) => (
                <div key={image} className="relative hidden min-h-[256px] bg-[#dddddd] sm:block">
                  <Image
                    src={image}
                    alt={`${listing.title} — photo ${index + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                  {index === 3 && (
                    <button className="absolute bottom-4 end-4 rounded-[8px] bg-white px-4 py-2 text-[13px] font-semibold text-[#222222] shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                      Voir les photos
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1760px] gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div className="space-y-8">
            <div className="rounded-[20px] bg-white p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-[16px] bg-[#f7f7f7] p-4">
                    <Icon className="mb-4 h-5 w-5 text-[#222222]" strokeWidth={1.8} />
                    <p className="text-[12px] text-[#6a6a6a]">{label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#222222]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Le bien</p>
                  <h2 className="text-[22px] font-bold tracking-[-0.009em]">Description</h2>
                </div>
                <div className="hidden rounded-[16px] bg-[#f7f7f7] px-4 py-3 text-end sm:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Score qualité</p>
                  <p className="mt-1 text-[22px] font-bold tracking-[-0.02em]">{listing.qualityScore}/100</p>
                </div>
              </div>

              <p className="max-w-3xl text-[15px] leading-[1.75] text-[#444444]">
                {listing.description}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {listing.highlights.map(({ label, value }) => (
                  <div key={label} className="rounded-[16px] border border-[#ebebeb] p-4">
                    <p className="text-[12px] text-[#6a6a6a]">{label}</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#222222]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-6 sm:p-8">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Équipements</p>
              <h2 className="mb-6 text-[22px] font-bold tracking-[-0.009em]">Ce que propose ce bien</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 rounded-[14px] border border-[#ebebeb] px-4 py-3 text-[14px] font-medium">
                    <Check className="h-4 w-4 text-[#E05C1A]" strokeWidth={2} />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Quartier</p>
                  <h2 className="text-[22px] font-bold tracking-[-0.009em]">{listing.district}, {listing.city}</h2>
                </div>
                <span className="hidden text-[13px] font-semibold text-[#222222] sm:inline">Voir la carte</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                <div className="relative min-h-[300px] overflow-hidden rounded-[20px] bg-[#f1ede7]">
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(#dddddd_1px,transparent_1px),linear-gradient(90deg,#dddddd_1px,transparent_1px)] [background-size:48px_48px]" />
                  <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#E05C1A] text-white shadow-[0_12px_30px_rgba(224,92,26,0.35)]">
                    <Home className="h-6 w-6" />
                  </div>
                  <div className="absolute bottom-4 start-4 rounded-[16px] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                    <p className="text-[13px] font-semibold">Zone approximative</p>
                    <p className="mt-0.5 text-[12px] text-[#6a6a6a]">Adresse exacte après contact agence</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {listing.nearby.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between rounded-[16px] border border-[#ebebeb] px-4 py-3">
                      <span className="text-[14px] font-medium text-[#222222]">{label}</span>
                      <span className="text-[13px] text-[#6a6a6a]">{value}</span>
                    </div>
                  ))}
                  <div className="rounded-[16px] bg-[#f7f7f7] p-4">
                    <p className="text-[13px] leading-[1.6] text-[#6a6a6a]">
                      Les temps sont indicatifs et servent à comprendre la vie de quartier avant une visite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[20px] bg-white p-5 shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px_0px,rgba(0,0,0,0.10)_0px_4px_8px_0px]">
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#ebebeb] pb-5">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Agence</p>
                  <p className="mt-1 text-[18px] font-bold tracking-[-0.009em]">{listing.agency ?? 'Maskani Partner'}</p>
                  <p className="mt-0.5 text-[13px] text-[#6a6a6a]">{listing.agentName} · {listing.agentRole}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF4EF] text-[16px] font-bold text-[#E05C1A]">
                  {listing.agentName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] bg-[#f7f7f7] p-3">
                  <Eye className="mb-3 h-4 w-4 text-[#222222]" />
                  <p className="text-[12px] text-[#6a6a6a]">Vues</p>
                  <p className="text-[15px] font-bold">{formatNumber(listing.views)}</p>
                </div>
                <div className="rounded-[16px] bg-[#f7f7f7] p-3">
                  <Heart className="mb-3 h-4 w-4 text-[#222222]" />
                  <p className="text-[12px] text-[#6a6a6a]">Favoris</p>
                  <p className="text-[15px] font-bold">{formatNumber(listing.saved)}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a href={`tel:${listing.agencyPhone.replaceAll(' ', '')}`} className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#E05C1A] text-[14px] font-semibold text-white transition-colors hover:bg-[#B84A12]">
                  <Phone className="h-4 w-4" />
                  Appeler l’agence
                </a>
                <a href={`mailto:${listing.agencyEmail}`} className="flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#222222] bg-white text-[14px] font-semibold text-[#222222] transition-colors hover:bg-[#f7f7f7]">
                  <Mail className="h-4 w-4" />
                  Envoyer un message
                </a>
              </div>

              <div className="mt-5 rounded-[16px] border border-[#ebebeb] p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E05C1A]" />
                  <p className="text-[13px] font-semibold">Annonce contrôlée par Maskani</p>
                </div>
                <p className="mt-2 text-[12px] leading-[1.55] text-[#6a6a6a]">
                  Identité agence, prix, photos et disponibilité vérifiés avant mise en avant.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-[1760px] px-6 pb-14">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Même niveau de qualité</p>
              <h2 className="text-[22px] font-bold tracking-[-0.009em]">Annonces similaires</h2>
            </div>
            <Link href="/annonces" className="hidden items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline sm:flex">
              Voir tout
            </Link>
          </div>

          <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
            {relatedListings.map((item) => (
              <ListingCard
                key={item.slug}
                listing={item}
                className="w-[82vw] snap-start sm:w-[44vw] lg:w-[calc(25%-9px)]"
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
