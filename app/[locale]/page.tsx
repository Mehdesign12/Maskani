import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import {
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
} from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SearchBar } from '@/components/search/SearchBar'
import { ListingCard, type ListingCardData } from '@/components/listing/ListingCard'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: `${t('appName')} — Immobilier Maroc`,
    description:
      'La plateforme immobilière de référence au Maroc. Appartements, villas, riads à Casablanca, Marrakech, Rabat et partout au Maroc.',
  }
}

// ── Mock data (remplacé par Supabase en Phase 1) ──────────────────────
const FEATURED_LISTINGS: ListingCardData[] = [
  {
    slug: 'appartement-moderne-maarif-casablanca',
    title: 'Appartement moderne — Maârif',
    city: 'Casablanca',
    district: 'Maârif',
    price: 185000000,
    area: 95,
    bedrooms: 3,
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&crop=center',
    isPremium: true,
  },
  {
    slug: 'villa-palmeraie-marrakech',
    title: 'Villa avec piscine — Palmeraie',
    city: 'Marrakech',
    district: 'Palmeraie',
    price: 450000000,
    area: 350,
    bedrooms: 5,
    type: 'villa',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=600&fit=crop&crop=center',
    isVerified: true,
  },
  {
    slug: 'appartement-hay-riad-rabat',
    title: 'Appartement neuf — Hay Riad',
    city: 'Rabat',
    district: 'Hay Riad',
    price: 120000000,
    area: 78,
    bedrooms: 2,
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop&crop=center',
    isVerified: true,
  },
  {
    slug: 'riad-medina-marrakech',
    title: 'Riad restauré — Médina',
    city: 'Marrakech',
    district: 'Médina',
    price: 320000000,
    area: 220,
    bedrooms: 4,
    type: 'riad',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center',
    isPremium: true,
  },
  {
    slug: 'villa-agadir-bord-mer',
    title: 'Villa bord de mer — Agadir',
    city: 'Agadir',
    price: 380000000,
    area: 280,
    bedrooms: 4,
    type: 'villa',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop&crop=center',
  },
  {
    slug: 'appartement-tanger-city-center',
    title: 'Appartement vue mer — Centre',
    city: 'Tanger',
    price: 8500000,
    area: 85,
    bedrooms: 2,
    type: 'appartement',
    transaction: 'location',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=600&fit=crop&crop=center',
    isVerified: true,
  },
  {
    slug: 'appartement-fes-ville-nouvelle',
    title: 'Appartement lumineux — Ville Nouvelle',
    city: 'Fès',
    district: 'Ville Nouvelle',
    price: 62000000,
    area: 70,
    bedrooms: 2,
    type: 'appartement',
    transaction: 'vente',
    imageUrl:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop&crop=center',
  },
  {
    slug: 'bureau-quartier-des-affaires-casa',
    title: 'Bureau premium — CFC',
    city: 'Casablanca',
    district: 'Casa Finance City',
    price: 45000000,
    area: 120,
    type: 'bureau',
    transaction: 'location',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop&crop=center',
  },
]

const POPULAR_CITIES = [
  { name: 'Casablanca', count: 42300, color: 'from-[#1B3A6B] to-[#2D5F9E]', emoji: '🌊' },
  { name: 'Marrakech', count: 18600, color: 'from-[#7B2D00] to-[#C04A0A]', emoji: '🏜️' },
  { name: 'Rabat', count: 12400, color: 'from-[#1A4A2A] to-[#2E7D3F]', emoji: '🌿' },
  { name: 'Tanger', count: 9800, color: 'from-[#00457A] to-[#0077B6]', emoji: '⚓' },
  { name: 'Fès', count: 7200, color: 'from-[#4A1A6B] to-[#7B2FBE]', emoji: '🏛️' },
  { name: 'Agadir', count: 6100, color: 'from-[#7A5000] to-[#C8870A]', emoji: '🏖️' },
]

const WHY_MASKANI = [
  {
    icon: ShieldCheck,
    title: 'Annonces vérifiées',
    description:
      'Chaque annonce passe par notre processus de vérification. Photos authentiques, prix réels, propriétaires identifiés.',
    accent: '#E05C1A',
  },
  {
    icon: TrendingUp,
    title: 'Prix du marché en temps réel',
    description:
      "Consultez les prix au m² par quartier, les tendances et l'historique des prix pour chaque ville du Maroc.",
    accent: '#1A7A5E',
  },
  {
    icon: Sparkles,
    title: 'Estimation IA',
    description:
      "Notre moteur d'estimation combine les données du marché et l'IA pour vous donner une valeur précise en secondes.",
    accent: '#5B4AE8',
  },
]

// ──────────────────────────────────────────────────────────────────────

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        {/* Warm gradient accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(224,92,26,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1760px] mx-auto px-6 pt-20 pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] bg-[#FFF4EF] border border-[#F4C5AE] text-[12px] font-semibold text-[#E05C1A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E05C1A] animate-pulse" />
              125 000+ annonces au Maroc
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-center text-[42px] sm:text-[52px] lg:text-[64px] font-bold text-[#222222] leading-[1.1] tracking-[-0.02em] mb-5 max-w-3xl mx-auto">
            Trouvez votre
            <br />
            <span className="text-[#E05C1A]">chez-vous</span> au Maroc
          </h1>

          <p className="text-center text-[16px] sm:text-[18px] text-[#6a6a6a] mb-10 max-w-xl mx-auto leading-relaxed">
            Appartements, villas, riads — achat ou location à Casablanca,
            Marrakech, Rabat et partout au Maroc.
          </p>

          {/* Search bar */}
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              'Casablanca',
              'Marrakech',
              'Rabat',
              'Appartement',
              'Villa',
              'Riad',
            ].map((tag) => (
              <Link
                key={tag}
                href={`/annonces?${tag === 'Appartement' || tag === 'Villa' || tag === 'Riad' ? `type=${tag.toLowerCase()}` : `city=${tag}`}`  as '/annonces'}
                className="px-4 py-1.5 rounded-[32px] bg-white border border-[#ebebeb] text-[13px] font-medium text-[#222222] hover:border-[#222222] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-10 pt-10 border-t border-[#f0f0f0]">
            {[
              { value: '125 000+', label: 'Annonces' },
              { value: '500+', label: 'Agences certifiées' },
              { value: '30+', label: 'Villes couvertes' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-[22px] font-bold text-[#222222] tracking-[-0.02em]">
                  {value}
                </p>
                <p className="text-[12px] text-[#6a6a6a] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED LISTINGS ─────────────────────────────────────── */}
      <section className="max-w-[1760px] mx-auto px-6 py-16">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.009em]">
            Annonces à la une
          </h2>
          <Link
            href="/annonces"
            className="flex items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Horizontal scroll carousel */}
        <div
          className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FEATURED_LISTINGS.map((listing) => (
            <ListingCard
              key={listing.slug}
              listing={listing}
              className="snap-start w-[calc(85vw-48px)] sm:w-[calc(45vw-24px)] lg:w-[calc(25%-12px)]"
            />
          ))}
        </div>
      </section>

      {/* ─── WHY MASKANI ────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#ebebeb]">
        <div className="max-w-[1760px] mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.009em] mb-2">
              Pourquoi Maskani ?
            </h2>
            <p className="text-[14px] text-[#6a6a6a] max-w-md mx-auto">
              Conçu pour surpasser les plateformes existantes sur chaque axe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_MASKANI.map(({ icon: Icon, title, description, accent }) => (
              <div
                key={title}
                className="p-7 rounded-[20px] bg-[#f7f7f7] hover:bg-[#f0f0f0] transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: accent }}
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-[16px] font-bold text-[#222222] mb-2">
                  {title}
                </h3>
                <p className="text-[14px] text-[#6a6a6a] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR CITIES ─────────────────────────────────────────── */}
      <section className="max-w-[1760px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.009em]">
            Villes populaires
          </h2>
          <Link
            href="/annonces"
            className="flex items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline"
          >
            Toutes les villes
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_CITIES.map(({ name, count, color, emoji }) => (
            <Link
              key={name}
              href={`/annonces?city=${name}` as '/annonces'}
              className="group relative overflow-hidden rounded-[20px] aspect-[4/3] flex flex-col justify-end p-4"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 group-hover:opacity-100 transition-opacity`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-10 group-hover:opacity-20 transition-opacity">
                {emoji}
              </div>
              <div className="relative">
                <p className="text-white font-bold text-[16px] tracking-[-0.009em]">
                  {name}
                </p>
                <p className="text-white/70 text-[12px] mt-0.5">
                  {count.toLocaleString('fr-MA')} annonces
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AGENCY CTA ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#ebebeb]">
        <div className="max-w-[1760px] mx-auto px-6 py-16">
          <div className="rounded-[20px] bg-gradient-to-br from-[#1a1a1a] to-[#333333] px-8 sm:px-12 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left */}
            <div className="text-center lg:text-start max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[32px] bg-white/10 text-[12px] font-semibold text-white/80 mb-4">
                <Building2 className="w-3.5 h-3.5" />
                Espace Agences & Promoteurs
              </div>
              <h2 className="text-[28px] font-bold text-white tracking-[-0.02em] mb-3">
                Développez votre activité avec Maskani
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed">
                Accédez à des milliers d&apos;acheteurs qualifiés, gérez vos annonces
                et suivez vos performances avec notre dashboard dédié.
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="flex flex-col gap-2.5 text-start">
                {[
                  'Annonces illimitées',
                  'Leads qualifiés',
                  'Analytics avancées',
                  'Badge agence certifiée',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#E05C1A] flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-medium text-white/80">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/inscription"
                className="shrink-0 px-6 py-3 rounded-[12px] bg-[#E05C1A] text-white font-semibold text-[15px] hover:bg-[#B84A12] transition-colors whitespace-nowrap"
              >
                Rejoindre Maskani
                <ArrowRight className="inline-block w-4 h-4 ms-2 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARKET DATA TEASER ─────────────────────────────────────── */}
      <section className="max-w-[1760px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.009em]">
              Données du marché
            </h2>
            <p className="text-[14px] text-[#6a6a6a] mt-1">
              Prix au m² en temps réel par ville et par quartier
            </p>
          </div>
          <Link
            href="/marche"
            className="flex items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline"
          >
            Explorer
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { city: 'Casablanca', avgSqm: 18400, trend: '+3.2%', color: '#1B3A6B' },
            { city: 'Marrakech', avgSqm: 14200, trend: '+5.8%', color: '#7B2D00' },
            { city: 'Rabat', avgSqm: 16800, trend: '+1.9%', color: '#1A4A2A' },
            { city: 'Tanger', avgSqm: 12600, trend: '+7.1%', color: '#00457A' },
            { city: 'Fès', avgSqm: 9400, trend: '+2.4%', color: '#4A1A6B' },
            { city: 'Agadir', avgSqm: 11200, trend: '+4.3%', color: '#7A5000' },
          ].map(({ city, avgSqm, trend, color }) => (
            <Link
              key={city}
              href={`/marche/${city.toLowerCase()}` as '/marche'}
              className="group flex items-center justify-between p-5 rounded-[16px] bg-white border border-[#ebebeb] hover:border-[#222222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <MapPin
                    className="w-5 h-5"
                    style={{ color }}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#222222]">
                    {city}
                  </p>
                  <p className="text-[12px] text-[#6a6a6a]">
                    {avgSqm.toLocaleString('fr-MA')} MAD / m²
                  </p>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-[#1A7A5E] bg-[#1A7A5E]/10 px-2.5 py-1 rounded-[32px]">
                {trend}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
