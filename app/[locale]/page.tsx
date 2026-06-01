import Image from 'next/image'
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  KeyRound,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { Footer } from '@/components/shared/Footer'
import { ListingCard } from '@/components/listing/ListingCard'
import { Navbar } from '@/components/shared/Navbar'
import { SearchBar } from '@/components/search/SearchBar'
import { Link } from '@/i18n/navigation'
import { FEATURED_LISTINGS } from '@/lib/listings'

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

const CITY_GUIDES = [
  {
    name: 'Casablanca',
    subtitle: 'Racine, Maârif, CFC',
    count: '42 300 annonces',
    image:
      'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=700&h=520&fit=crop&crop=center',
  },
  {
    name: 'Marrakech',
    subtitle: 'Guéliz, Hivernage, Palmeraie',
    count: '18 600 annonces',
    image:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&h=520&fit=crop&crop=center',
  },
  {
    name: 'Rabat',
    subtitle: 'Hay Riad, Agdal, Souissi',
    count: '12 400 annonces',
    image:
      'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=700&h=520&fit=crop&crop=center',
  },
]

const TRUST_SIGNALS = [
  {
    icon: ShieldCheck,
    title: 'Annonces vérifiées',
    text: 'Photos, prix, disponibilité et identité agence contrôlés avant mise en avant.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Prix lisibles',
    text: 'Prix au m², historique quartier et comparaison locale pour éviter les annonces gonflées.',
  },
  {
    icon: KeyRound,
    title: 'Contact qualifié',
    text: 'Un parcours pensé pour réduire les faux leads et rapprocher acheteurs sérieux et agences fiables.',
  },
]

const MARKET_DATA = [
  { city: 'Casablanca', avgSqm: 18400, trend: '+3,2%', note: 'Racine tire le haut du marché' },
  { city: 'Marrakech', avgSqm: 14200, trend: '+5,8%', note: 'Forte demande sur villas et riads' },
  { city: 'Rabat', avgSqm: 16800, trend: '+1,9%', note: 'Hay Riad reste très liquide' },
  { city: 'Tanger', avgSqm: 12600, trend: '+7,1%', note: 'Front de mer en accélération' },
]

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#222222]">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[#ebebeb] bg-white">
          <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_70%_70%_at_50%_-20%,rgba(224,92,26,0.08),transparent_68%)]" />

          <div className="relative mx-auto grid max-w-[1760px] gap-12 px-6 pb-16 pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:items-center lg:pb-20 lg:pt-16">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-start">
              <div className="mb-5 inline-flex items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#222222] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E05C1A]" />
                Immobilier vérifié, quartier par quartier
              </div>

              <h1 className="mx-auto max-w-4xl text-[42px] font-bold leading-[1.02] tracking-[-0.04em] text-[#222222] sm:text-[58px] lg:mx-0 lg:text-[72px]">
                Trouvez un bien fiable au Maroc, sans perdre des semaines.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.6] text-[#6a6a6a] sm:text-[18px] lg:mx-0">
                Des annonces immobilières propres, comparables et vérifiées — avec les bons quartiers, le vrai prix au m² et des agences identifiées.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <SearchBar />
              </div>
            </div>

            <div className="relative hidden min-h-[530px] lg:block">
              <div className="absolute end-0 top-0 w-[70%] overflow-hidden rounded-[20px] bg-[#dddddd] shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
                <Image
                  src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=900&h=1080&fit=crop&crop=center"
                  alt="Appartement marocain lumineux"
                  width={760}
                  height={900}
                  priority
                  className="aspect-[0.78/1] w-full object-cover"
                />
              </div>

              <div className="absolute bottom-6 start-0 w-[58%] overflow-hidden rounded-[20px] bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                <Image
                  src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=720&h=560&fit=crop&crop=center"
                  alt="Salon moderne"
                  width={640}
                  height={480}
                  className="aspect-[1.25/1] rounded-[16px] object-cover"
                />
                <div className="px-2 pb-2 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold tracking-[-0.009em]">Racine, Casablanca</p>
                      <p className="mt-0.5 text-[12px] text-[#6a6a6a]">128 m² · 3 ch. · vérifié</p>
                    </div>
                    <BadgeCheck className="h-5 w-5 shrink-0 text-[#E05C1A]" />
                  </div>
                </div>
              </div>

              <div className="absolute end-8 bottom-20 rounded-[20px] bg-white px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Prix quartier</p>
                <p className="mt-1 text-[24px] font-bold tracking-[-0.02em]">18 400 MAD/m²</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1760px] px-6 py-14">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Sélection éditoriale</p>
              <h2 className="text-[22px] font-bold tracking-[-0.009em] text-[#222222]">Biens vérifiés cette semaine</h2>
            </div>
            <Link href="/annonces" className="hidden items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline sm:flex">
              Voir tout
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
            {FEATURED_LISTINGS.map((listing, index) => (
              <ListingCard
                key={listing.slug}
                listing={listing}
                priority={index < 2}
                className="w-[82vw] snap-start sm:w-[44vw] lg:w-[calc(25%-9px)] xl:w-[calc(20%-10px)]"
              />
            ))}
          </div>
        </section>

        <section className="border-y border-[#ebebeb] bg-white">
          <div className="mx-auto grid max-w-[1760px] gap-8 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Pourquoi Maskani</p>
              <h2 className="max-w-md text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-[#222222]">
                Moins d&apos;annonces douteuses. Plus de décisions claires.
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.6] text-[#6a6a6a]">
                Le design reste léger comme une marketplace moderne, mais chaque détail sert la confiance : vérification, prix au m², fraîcheur et qualité des interlocuteurs.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {TRUST_SIGNALS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[20px] bg-[#f7f7f7] p-6 transition-colors hover:bg-[#f0f0f0]">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#E05C1A] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[15px] font-bold tracking-[-0.009em] text-[#222222]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#6a6a6a]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1760px] px-6 py-14">
          <div className="mb-5 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Guides locaux</p>
              <h2 className="text-[22px] font-bold tracking-[-0.009em] text-[#222222]">Explorer par ville</h2>
            </div>
            <Link href="/annonces" className="hidden items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline sm:flex">
              Toutes les villes
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {CITY_GUIDES.map(({ name, subtitle, count, image }) => (
              <Link key={name} href={`/annonces?city=${name}` as '/annonces'} className="group overflow-hidden rounded-[20px] bg-white">
                <div className="relative aspect-[1.5/1] overflow-hidden bg-[#dddddd]">
                  <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                  <div className="absolute bottom-4 start-4 text-white">
                    <p className="text-[21px] font-bold tracking-[-0.02em]">{name}</p>
                    <p className="mt-1 text-[12px] font-medium text-white/80">{count}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-[13px] font-medium text-[#6a6a6a]">{subtitle}</p>
                  <ChevronRight className="h-4 w-4 text-[#222222] rtl:rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#ebebeb] bg-white">
          <div className="mx-auto max-w-[1760px] px-6 py-14">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">Données du marché</p>
                <h2 className="text-[22px] font-bold tracking-[-0.009em] text-[#222222]">Prix au m² par ville</h2>
              </div>
              <Link href="/marche" className="hidden items-center gap-1 text-[14px] font-semibold text-[#222222] hover:underline sm:flex">
                Explorer
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MARKET_DATA.map(({ city, avgSqm, trend, note }) => (
                <Link key={city} href={`/marche/${city.toLowerCase()}` as '/marche'} className="group rounded-[20px] border border-[#ebebeb] bg-white p-5 transition-colors hover:border-[#222222]">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7f7f7] text-[#222222]">
                      <MapPin className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="rounded-[32px] bg-[#f7f7f7] px-2.5 py-1 text-[12px] font-semibold text-[#222222]">{trend}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#222222]">{city}</p>
                  <p className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-[#222222]">{avgSqm.toLocaleString('fr-MA')}</p>
                  <p className="mt-0.5 text-[12px] text-[#6a6a6a]">MAD / m²</p>
                  <p className="mt-4 border-t border-[#ebebeb] pt-4 text-[12px] leading-[1.45] text-[#6a6a6a]">{note}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1760px] px-6 py-14">
          <div className="overflow-hidden rounded-[20px] bg-[#222222] text-white">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-[32px] bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/80">
                  <Building2 className="h-3.5 w-3.5" />
                  Espace Agences & Promoteurs
                </div>
                <h2 className="max-w-xl text-[28px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[36px]">
                  Publiez des annonces propres. Recevez des leads plus sérieux.
                </h2>
              </div>
              <div className="flex flex-col gap-6 lg:items-end">
                <p className="max-w-xl text-[15px] leading-[1.6] text-white/65 lg:text-end">
                  Un espace professionnel pensé pour mettre en avant les biens réellement disponibles, suivre les performances et rassurer les acheteurs dès la première visite.
                </p>
                <Link href="/inscription" className="inline-flex w-fit items-center rounded-[8px] bg-[#E05C1A] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#B84A12]">
                  Rejoindre Maskani
                  <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
