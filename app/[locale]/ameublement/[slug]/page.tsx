import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ArrowLeft, MessageCircle, Phone, Star, Truck, Package, CheckCircle, Globe } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { getProduitBySlug, getSimilarProduits, PRODUITS } from '@/lib/produits'
import { ImageGallery } from '@/components/ameublement/ImageGallery'
import { ProduitCard } from '@/components/ameublement/ProduitCard'
import { CATEGORY_META } from '@/lib/category-meta'
import type { Produit } from '@/types/produit'

export async function generateStaticParams() {
  return PRODUITS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const produit = getProduitBySlug(slug)
  if (!produit) return {}
  return {
    title: `${produit.name} — Maskani`,
    description: produit.description.slice(0, 155),
  }
}

export default async function ProduitDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  setRequestLocale(locale)

  const produit = getProduitBySlug(slug)
  if (!produit) notFound()

  const similar = getSimilarProduits(slug, produit.category, 4)
  const cat = CATEGORY_META[produit.category] ?? CATEGORY_META['salon']
  const discount = produit.oldPrice
    ? Math.round((1 - produit.price / produit.oldPrice) * 100)
    : null

  const waNumber = produit.whatsapp.replace(/\D/g, '')
  const waMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par "${produit.name}" (${produit.price.toLocaleString('fr-MA')} MAD) que j'ai trouvé sur Maskani.`
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fafafa]">
        {/* ── Breadcrumb ── */}
        <div className="border-b border-[#ebebeb] bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/ameublement"
              className="flex items-center gap-1.5 text-[13px] text-[#888888] transition-colors hover:text-[#222222]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Ameublement & Accessoires
            </Link>
            <span className="text-[#cccccc]">/</span>
            <span className={`rounded-[8px] px-2 py-0.5 text-[11px] font-semibold ${cat.bg} ${cat.text}`}>
              {cat.emoji} {cat.label}
            </span>
            <span className="text-[#cccccc]">/</span>
            <span className="line-clamp-1 text-[13px] font-medium text-[#222222]">{produit.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">

            {/* ── Left column ── */}
            <div className="min-w-0">
              {/* Gallery */}
              <ImageGallery images={produit.images} name={produit.name} />

              {/* Mobile CTA (below gallery on small screens) */}
              <div className="mt-5 lg:hidden">
                <PriceSidebar produit={produit} waNumber={waNumber} waMessage={waMessage} discount={discount} />
              </div>

              {/* Description */}
              <div className="mt-8 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                <h2 className="mb-3 text-[17px] font-bold text-[#222222]">Description</h2>
                <p className="text-[14px] leading-[1.75] text-[#555555]">{produit.description}</p>

                {/* Specs grid */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {produit.dimensions && (
                    <div className="rounded-[12px] bg-[#fafafa] p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">Dimensions</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#222222]">{produit.dimensions}</p>
                    </div>
                  )}
                  {produit.material && (
                    <div className="rounded-[12px] bg-[#fafafa] p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">Matériaux</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-[#222222]">{produit.material}</p>
                    </div>
                  )}
                  <div className="rounded-[12px] bg-[#fafafa] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">Marque</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#222222]">{produit.brand}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#fafafa] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#aaaaaa]">Ville</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#222222]">{produit.city}</p>
                  </div>
                </div>
              </div>

              {/* Colors */}
              {produit.colors.length > 0 && (
                <div className="mt-5 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                  <h2 className="mb-3 text-[17px] font-bold text-[#222222]">Coloris disponibles</h2>
                  <div className="flex flex-wrap gap-2">
                    {produit.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-[10px] border border-[#e5e5e5] px-3 py-1.5 text-[13px] font-medium text-[#444444]"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features checklist */}
              <div className="mt-5 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                <h2 className="mb-4 text-[17px] font-bold text-[#222222]">Points forts</h2>
                <ul className="space-y-2.5">
                  {produit.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span className="text-[14px] text-[#444444]">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery & contact info */}
              <div className="mt-5 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                <h2 className="mb-4 text-[17px] font-bold text-[#222222]">Livraison & contact</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f5]">
                      <Truck className="h-4 w-4 text-[#555555]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#222222]">Délai de livraison</p>
                      <p className="text-[12px] text-[#888888]">{produit.deliveryTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f5]">
                      <Package className="h-4 w-4 text-[#555555]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#222222]">Disponibilité</p>
                      <p className={`text-[12px] font-semibold ${produit.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                        {produit.inStock ? 'En stock — expédition rapide' : 'Rupture de stock temporaire'}
                      </p>
                    </div>
                  </div>
                  {produit.website && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f5]">
                        <Globe className="h-4 w-4 text-[#555555]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#222222]">Site web</p>
                        <a href={produit.website} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#4F6AE8] hover:underline">
                          {produit.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right column (sticky sidebar) ── */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <PriceSidebar produit={produit} waNumber={waNumber} waMessage={waMessage} discount={discount} />
              </div>
            </div>
          </div>

          {/* ── Similar products ── */}
          {similar.length > 0 && (
            <section className="mt-16">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#222222]">
                    Produits similaires
                  </h2>
                  <p className="mt-1 text-[14px] text-[#888888]">
                    D&apos;autres articles qui pourraient vous plaire
                  </p>
                </div>
                <Link
                  href="/ameublement"
                  className="hidden text-[13px] font-semibold text-[#B19272] transition-colors hover:text-[#9a7a5a] sm:block"
                >
                  Voir tout →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((p) => (
                  <ProduitCard key={p.slug} produit={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Price sidebar ──
interface SidebarProps {
  produit: Produit
  waNumber: string
  waMessage: string
  discount: number | null
}

function PriceSidebar({ produit, waNumber, waMessage, discount }: SidebarProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      {/* Header */}
      <div className="border-b border-[#f0f0f0] p-5">
        <div className="mb-2 flex items-center gap-2">
          {produit.isNew && (
            <span className="rounded-[8px] bg-[#222222] px-2 py-0.5 text-[10px] font-bold text-white">Nouveau</span>
          )}
          {produit.isBestSeller && !produit.isNew && (
            <span className="rounded-[8px] bg-[#B19272] px-2 py-0.5 text-[10px] font-bold text-white">Best-seller</span>
          )}
        </div>
        <h1 className="text-[17px] font-bold leading-[1.3] text-[#222222]">{produit.name}</h1>
        <p className="mt-1 text-[13px] text-[#888888]">
          {produit.brand} · {produit.city}
        </p>
        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(produit.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-[#e5e5e5] text-[#e5e5e5]'
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] font-semibold text-[#222222]">{produit.rating}</span>
          <span className="text-[12px] text-[#aaaaaa]">({produit.reviewCount} avis)</span>
        </div>
      </div>

      {/* Price */}
      <div className="border-b border-[#f0f0f0] p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-[28px] font-bold tracking-[-0.02em] text-[#222222]">
            {produit.price.toLocaleString('fr-MA')} MAD
          </span>
          {discount && (
            <span className="rounded-[8px] bg-red-50 px-2 py-0.5 text-[12px] font-bold text-red-500">
              -{discount}%
            </span>
          )}
        </div>
        {produit.oldPrice && (
          <p className="mt-0.5 text-[13px] text-[#aaaaaa] line-through">
            {produit.oldPrice.toLocaleString('fr-MA')} MAD
          </p>
        )}
        {produit.oldPrice && (
          <p className="mt-1 text-[12px] font-semibold text-emerald-600">
            Vous économisez {(produit.oldPrice - produit.price).toLocaleString('fr-MA')} MAD
          </p>
        )}

        {/* Stock */}
        <div className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${produit.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
          <div className={`h-2 w-2 rounded-full ${produit.inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
          {produit.inStock ? 'En stock' : 'Rupture de stock'}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 p-5">
        <a
          href={`https://wa.me/${waNumber}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#25D366] py-3.5 text-[15px] font-bold text-white transition-all hover:bg-[#1ea855] active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" />
          Contacter sur WhatsApp
        </a>
        <a
          href={`tel:${produit.phone}`}
          className="flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-[#e5e5e5] bg-white py-3.5 text-[14px] font-semibold text-[#222222] transition-all hover:bg-[#f5f5f5] active:scale-[0.98]"
        >
          <Phone className="h-4 w-4" />
          {produit.phone}
        </a>
      </div>

      {/* Safety note */}
      <div className="border-t border-[#f0f0f0] px-5 py-3">
        <p className="text-center text-[11px] text-[#aaaaaa]">
          Contact direct avec le vendeur — aucun intermédiaire
        </p>
      </div>
    </div>
  )
}
