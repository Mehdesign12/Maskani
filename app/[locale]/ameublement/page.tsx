import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { Armchair, Star, Truck, Shield, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { getProduitCardData } from '@/lib/produits'
import { ProduitsDirectory } from '@/components/ameublement/ProduitsDirectory'

export const metadata: Metadata = {
  title: 'Ameublement & Accessoires — Maskani',
  description: "Découvrez le meilleur du mobilier et de la décoration marocaine. Artisanat authentique, design moderne et contemporain livré partout au Maroc.",
}

const ROOMS = [
  {
    label: 'Salon',
    catKey: 'salon',
    emoji: '🛋️',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop',
    accent: 'from-amber-900/60',
  },
  {
    label: 'Chambre',
    catKey: 'chambre',
    emoji: '🛏️',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=450&fit=crop',
    accent: 'from-purple-900/60',
  },
  {
    label: 'Cuisine',
    catKey: 'cuisine',
    emoji: '🍳',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=450&fit=crop',
    accent: 'from-red-900/60',
  },
  {
    label: 'Salle de bain',
    catKey: 'salle-de-bain',
    emoji: '🚿',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=450&fit=crop',
    accent: 'from-sky-900/60',
  },
  {
    label: 'Décoration',
    catKey: 'decoration',
    emoji: '🎨',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=450&fit=crop',
    accent: 'from-pink-900/60',
  },
  {
    label: 'Luminaires',
    catKey: 'luminaires',
    emoji: '💡',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=450&fit=crop',
    accent: 'from-orange-900/60',
  },
  {
    label: 'Tapis & Textiles',
    catKey: 'tapis-textiles',
    emoji: '🪡',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=450&fit=crop',
    accent: 'from-green-900/60',
  },
  {
    label: 'Terrasse',
    catKey: 'terrasse',
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=600&h=450&fit=crop',
    accent: 'from-emerald-900/60',
  },
  {
    label: 'Accessoires',
    catKey: 'accessoires',
    emoji: '🪴',
    image: 'https://images.unsplash.com/photo-1567225557594-88887e55ce7a?w=600&h=450&fit=crop',
    accent: 'from-fuchsia-900/60',
  },
  {
    label: 'Domotique',
    catKey: 'domotique',
    emoji: '🏠',
    image: 'https://images.unsplash.com/photo-1558618047-3caa1a3e8b58?w=600&h=450&fit=crop',
    accent: 'from-blue-900/60',
  },
  {
    label: 'Bureau',
    catKey: 'bureau',
    emoji: '🖥️',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=450&fit=crop',
    accent: 'from-teal-900/60',
  },
  {
    label: 'Enfants',
    catKey: 'enfants',
    emoji: '🧸',
    image: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=600&h=450&fit=crop',
    accent: 'from-yellow-900/60',
  },
]

const TRUST = [
  { icon: Star,          label: '4.8 / 5', sublabel: 'Note moyenne des produits' },
  { icon: Truck,         label: 'Livraison partout', sublabel: 'Dans toutes les villes du Maroc' },
  { icon: MessageCircle, label: 'Contact direct', sublabel: 'Via WhatsApp avec le vendeur' },
  { icon: Shield,        label: 'Artisans vérifiés', sublabel: 'Marques et artisans certifiés' },
]

export default async function AmeublementPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const produits = getProduitCardData()
  const newCount = produits.filter((p) => p.isNew).length

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-[#fafafa]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1a1208] py-16 sm:py-24">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&h=700&fit=crop"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/60 via-[#1a1208]/80 to-[#1a1208]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-[32px] border border-[#B19272]/30 bg-[#B19272]/10 px-4 py-1.5">
              <Armchair className="h-4 w-4 text-[#B19272]" />
              <span className="text-[13px] font-semibold text-[#d4b896]">Ameublement & Accessoires</span>
            </div>

            <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[52px]">
              L&apos;artisanat marocain,<br />
              <span className="text-[#B19272]">dans votre intérieur.</span>
            </h1>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#b0a090] sm:text-[18px]">
              Mobilier authentique, décoration contemporaine et accessoires de maison — sélectionnés auprès
              des meilleurs artisans et marques du Maroc.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-[28px] font-bold text-white">{produits.length}+</p>
                <p className="text-[13px] text-[#b0a090]">Produits disponibles</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-[28px] font-bold text-white">{newCount}</p>
                <p className="text-[13px] text-[#b0a090]">Nouveautés ce mois</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-[28px] font-bold text-white">12</p>
                <p className="text-[13px] text-[#b0a090]">Catégories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Room categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8">
          <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#222222] sm:text-[28px]">
            Explorer par pièce
          </h2>
          <p className="mt-1 text-[14px] text-[#888888]">
            Trouvez exactement ce qu&apos;il vous faut, pièce par pièce.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {ROOMS.map(({ label, catKey, emoji, image, accent }) => (
            <Link
              key={label}
              href={`/ameublement?cat=${catKey}#catalogue` as '/ameublement'}
              className="group relative overflow-hidden rounded-[18px]"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${accent} to-transparent`} />
              <div className="absolute bottom-3 left-3">
                <p className="text-[18px]">{emoji}</p>
                <p className="text-[13px] font-bold text-white">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Lookbook strip ── */}
      <section className="relative overflow-hidden py-12 sm:py-16" style={{ background: 'linear-gradient(135deg, #fdf4e7 0%, #fefbf7 50%, #f0fdf4 100%)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
            {/* Text */}
            <div className="max-w-md flex-1">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#B19272]">
                Inspiration déco
              </p>
              <h2 className="text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-[#222222] sm:text-[32px]">
                Créez votre intérieur de rêve avec l&apos;artisanat marocain
              </h2>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#666666]">
                Du zellige de Fès aux tapis Beni Ouarain, en passant par le tadelakt et le cuivre ciselé —
                notre sélection allie authenticité et design contemporain pour un intérieur qui vous ressemble.
              </p>
              <div className="mt-6 flex gap-3">
                <div className="rounded-[14px] bg-white/80 px-4 py-3 text-center shadow-sm">
                  <p className="text-[20px] font-bold text-[#B19272]">100%</p>
                  <p className="text-[11px] text-[#888888]">Maroc</p>
                </div>
                <div className="rounded-[14px] bg-white/80 px-4 py-3 text-center shadow-sm">
                  <p className="text-[20px] font-bold text-[#B19272]">Artisans</p>
                  <p className="text-[11px] text-[#888888]">certifiés</p>
                </div>
                <div className="rounded-[14px] bg-white/80 px-4 py-3 text-center shadow-sm">
                  <p className="text-[20px] font-bold text-[#B19272]">Direct</p>
                  <p className="text-[11px] text-[#888888]">WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Lookbook grid */}
            <div className="grid w-full max-w-sm grid-cols-2 gap-2.5 md:max-w-xs">
              {[
                'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1513506003901-1e6a35b7e5c3?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop',
              ].map((src, i) => (
                <div key={i} className="relative overflow-hidden rounded-[14px]" style={{ aspectRatio: '1/1' }}>
                  <Image
                    src={src}
                    alt="Inspiration déco"
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-500 hover:scale-[1.06]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="border-y border-[#ebebeb] bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST.map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fdf4e7]">
                  <Icon className="h-5 w-5 text-[#B19272]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#222222]">{label}</p>
                  <p className="text-[11px] text-[#888888]">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product catalog ── */}
      <section id="catalogue" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#222222] sm:text-[28px]">
              Catalogue complet
            </h2>
            <p className="mt-1 text-[14px] text-[#888888]">
              {produits.length} produits sélectionnés pour votre intérieur
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="py-16 text-center text-[14px] text-[#888888]">Chargement…</div>}>
          <ProduitsDirectory produits={produits} />
        </Suspense>
      </section>
    </main>
    <Footer />
    </>
  )
}
