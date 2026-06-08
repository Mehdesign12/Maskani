import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Languages,
  Mail,
  MapPin,
  Phone,
  Share2,
  Star,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PresataireCard, CATEGORY_META } from '@/components/prestataire/PresataireCard'
import { getPresataireBySlug, getRelatedPrestataires, PRESTATAIRES } from '@/lib/prestataires'
import { Link } from '@/i18n/navigation'

export async function generateStaticParams() {
  return PRESTATAIRES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const p = getPresataireBySlug(slug)
  if (!p) return {}
  return {
    title: `${p.name} — ${p.title} | Maskani`,
    description: p.bio.slice(0, 155),
  }
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= Math.round(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#e5e5e5] text-[#e5e5e5]'}`}
        />
      ))}
    </div>
  )
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2.5 text-[12px]">
      <span className="w-3 shrink-0 text-right text-[#6a6a6a]">{stars}</span>
      <Star className="h-3 w-3 shrink-0 fill-[#F59E0B] text-[#F59E0B]" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f0f0f0]">
        <div
          className="h-full rounded-full bg-[#F59E0B] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-4 shrink-0 text-[#aaaaaa]">{count}</span>
    </div>
  )
}

export default async function PresataireDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  setRequestLocale(locale)

  const prestataire = getPresataireBySlug(slug)
  if (!prestataire) notFound()

  const related = getRelatedPrestataires(slug, prestataire.category)
  const cat = CATEGORY_META[prestataire.category] ?? CATEGORY_META.agent

  const availMeta = {
    disponible: { dot: 'bg-emerald-500', label: 'Disponible' },
    occupe:     { dot: 'bg-amber-400',   label: 'Occupé' },
    sur_rdv:    { dot: 'bg-blue-500',    label: 'Sur RDV uniquement' },
  }[prestataire.availability]

  // Star distribution
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: prestataire.reviews.filter((r) => r.rating === s).length,
  }))

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#222222]">
      <Navbar />

      <main>
        {/* ── Cover image ──────────────────────────────────────────────── */}
        <div className="relative h-[280px] w-full overflow-hidden bg-[#dddddd] sm:h-[340px]">
          <Image
            src={prestataire.coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Back */}
          <Link
            href="/prestataires"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#222222] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:left-8 sm:top-6"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>

          {/* Share */}
          <button
            aria-label="Partager"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#222222] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:right-8 sm:top-6"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* ── Profile header — overlapping cover ───────────────────────── */}
        <div className="relative z-10 -mt-12 rounded-t-[28px] bg-white sm:-mt-16">
          <div className="mx-auto max-w-[1760px] px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

              {/* Avatar + name block */}
              <div className="flex items-end gap-5">
                <div className="relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[18px] border-[3px] border-white bg-[#ebebeb] shadow-[0_4px_20px_rgba(0,0,0,0.14)] sm:h-[96px] sm:w-[96px]">
                  <Image
                    src={prestataire.avatar}
                    alt={prestataire.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {prestataire.isVerified && (
                    <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                      <BadgeCheck className="h-5 w-5 text-[#B19272]" fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-[32px] px-2.5 py-0.5 text-[11px] font-semibold ${cat.bg} ${cat.text}`}>
                      {cat.label}
                    </span>
                    {prestataire.isPremium && (
                      <span className="rounded-[4px] bg-[#B19272] px-2 py-0.5 text-[11px] font-bold text-white">
                        Premium
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${availMeta.dot}`} />
                      <span className="text-[12px] font-medium text-[#6a6a6a]">{availMeta.label}</span>
                    </div>
                  </div>

                  <h1 className="text-[22px] font-bold tracking-[-0.025em] text-[#222222] sm:text-[26px]">
                    {prestataire.name}
                  </h1>
                  <p className="mt-0.5 text-[14px] text-[#6a6a6a]">{prestataire.title}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <StarRow rating={prestataire.rating} />
                      <span className="text-[13px] font-bold text-[#222222]">{prestataire.rating.toFixed(1)}</span>
                      <span className="text-[13px] text-[#6a6a6a]">· {prestataire.reviewCount} avis</span>
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-[#6a6a6a]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{prestataire.district}, {prestataire.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 sm:pb-1">
                <a
                  href={`tel:${prestataire.phone}`}
                  className="flex items-center gap-2 rounded-[8px] bg-[#222222] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#B19272]"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
                <a
                  href={`mailto:${prestataire.email}`}
                  className="flex items-center gap-2 rounded-[8px] border border-[#ebebeb] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#222222] transition-colors hover:border-[#c8c8c8]"
                >
                  <Mail className="h-4 w-4" />
                  Message
                </a>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-[#ebebeb] bg-[#ebebeb] sm:grid-cols-4">
              {[
                { icon: Briefcase, value: `${prestataire.completedProjects.toLocaleString('fr-FR')}`, label: 'Projets réalisés' },
                { icon: Clock,     value: `${prestataire.yearsExperience} ans`, label: 'D\'expérience' },
                { icon: Zap,       value: prestataire.responseTime.replace('Répond ', ''), label: 'Temps de réponse' },
                { icon: Star,      value: prestataire.rating.toFixed(1), label: `${prestataire.reviewCount} avis clients` },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-white px-4 py-5 text-center">
                  <Icon className="h-4 w-4 text-[#aaaaaa]" strokeWidth={1.8} />
                  <p className="text-[18px] font-bold tracking-[-0.02em] text-[#222222] sm:text-[20px]">{value}</p>
                  <p className="text-[11px] text-[#6a6a6a]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content grid ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-[1760px] px-6 py-10 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

            {/* ── LEFT: bio + services + portfolio + reviews ──────────── */}
            <div className="space-y-10">

              {/* Bio */}
              <section>
                <h2 className="mb-4 text-[18px] font-bold tracking-[-0.015em] text-[#222222]">
                  À propos
                </h2>
                <p className="text-[14px] leading-[1.75] text-[#444444]">{prestataire.bio}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {prestataire.specializations.map((s) => (
                    <span key={s} className="rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#555555]">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Services */}
              <section>
                <h2 className="mb-4 text-[18px] font-bold tracking-[-0.015em] text-[#222222]">
                  Services proposés
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {prestataire.services.map((s) => (
                    <div key={s} className="flex items-center gap-3 rounded-[12px] border border-[#ebebeb] bg-white px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B19272]" strokeWidth={2} />
                      <span className="text-[13px] font-medium text-[#222222]">{s}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Portfolio */}
              {prestataire.portfolio.length > 0 && (
                <section>
                  <h2 className="mb-4 text-[18px] font-bold tracking-[-0.015em] text-[#222222]">
                    Réalisations
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {prestataire.portfolio.map(({ url, caption }) => (
                      <div
                        key={url}
                        className="group relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[#ebebeb]"
                      >
                        <Image
                          src={url}
                          alt={caption}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        <p className="absolute bottom-0 left-0 right-0 translate-y-2 px-3 pb-3 text-[12px] font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          {caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section>
                <h2 className="mb-6 text-[18px] font-bold tracking-[-0.015em] text-[#222222]">
                  Avis clients
                </h2>

                {/* Rating summary */}
                <div className="mb-8 flex flex-col gap-6 rounded-[20px] border border-[#ebebeb] bg-white p-6 sm:flex-row sm:items-center sm:gap-10">
                  <div className="flex shrink-0 flex-col items-center gap-1.5">
                    <p className="text-[52px] font-bold leading-none tracking-[-0.04em] text-[#222222]">
                      {prestataire.rating.toFixed(1)}
                    </p>
                    <StarRow rating={prestataire.rating} />
                    <p className="text-[12px] text-[#6a6a6a]">{prestataire.reviewCount} avis</p>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    {starCounts.map(({ stars, count }) => (
                      <RatingBar
                        key={stars}
                        stars={stars}
                        count={count}
                        total={prestataire.reviews.length}
                      />
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-4">
                  {prestataire.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-[16px] border border-[#ebebeb] bg-white p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[12px] font-bold text-[#555555]">
                            {review.authorInitials}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#222222]">{review.author}</p>
                            <p className="text-[11px] text-[#aaaaaa]">{review.date}</p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-[32px] bg-[#f7f7f7] px-2.5 py-0.5 text-[11px] font-medium text-[#555555]">
                          {review.projectType}
                        </span>
                      </div>

                      <div className="mb-2.5 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#e5e5e5] text-[#e5e5e5]'}`}
                          />
                        ))}
                      </div>

                      <p className="text-[13px] leading-[1.65] text-[#444444]">{review.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── RIGHT: sticky contact card ───────────────────────────── */}
            <aside className="space-y-5">
              <div className="sticky top-24 space-y-5">

                {/* Contact card */}
                <div className="rounded-[20px] border border-[#ebebeb] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#ebebeb]">
                      <Image src={prestataire.avatar} alt={prestataire.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#222222]">{prestataire.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-[12px] font-semibold text-[#222222]">{prestataire.rating.toFixed(1)}</span>
                        <span className="text-[12px] text-[#6a6a6a]">· {prestataire.reviewCount} avis</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[14px] font-bold text-[#222222]">{prestataire.priceInfo}</p>
                    {prestataire.isVerified && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#B19272]">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Vérifié
                      </div>
                    )}
                  </div>
                  <div className="mb-5 flex items-center gap-1 text-[12px] text-[#6a6a6a]">
                    <Zap className="h-3.5 w-3.5 shrink-0" />
                    {prestataire.responseTime}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`tel:${prestataire.phone}`}
                      className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#222222] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#B19272]"
                    >
                      <Phone className="h-4 w-4" />
                      Appeler maintenant
                    </a>
                    <a
                      href={`mailto:${prestataire.email}`}
                      className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#ebebeb] px-4 py-3 text-[14px] font-semibold text-[#222222] transition-colors hover:border-[#c8c8c8]"
                    >
                      <Mail className="h-4 w-4" />
                      Envoyer un message
                    </a>
                    {prestataire.website && (
                      <a
                        href={`https://${prestataire.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#ebebeb] px-4 py-3 text-[13px] font-medium text-[#6a6a6a] transition-colors hover:border-[#c8c8c8] hover:text-[#222222]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {prestataire.website}
                      </a>
                    )}
                  </div>

                  {/* Quick stats */}
                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-[12px] bg-[#f7f7f7] p-3 text-center">
                    {[
                      { value: prestataire.completedProjects.toLocaleString('fr-FR'), label: 'Projets' },
                      { value: `${prestataire.yearsExperience}`, label: 'Années' },
                      { value: prestataire.rating.toFixed(1), label: 'Note' },
                    ].map(({ value, label }) => (
                      <div key={label}>
                        <p className="text-[16px] font-bold text-[#222222]">{value}</p>
                        <p className="text-[10px] text-[#aaaaaa]">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-[#aaaaaa]" strokeWidth={1.8} />
                    <p className="text-[13px] font-semibold text-[#222222]">Langues parlées</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prestataire.languages.map((lang) => (
                      <span key={lang} className="rounded-[32px] bg-[#f7f7f7] px-3 py-1 text-[12px] font-medium text-[#555555]">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-[#B19272]" strokeWidth={1.8} />
                    <p className="text-[13px] font-semibold text-[#222222]">Certifications & agréments</p>
                  </div>
                  <ul className="space-y-2">
                    {prestataire.certifications.map((cert) => (
                      <li key={cert} className="flex items-start gap-2 text-[12px] text-[#444444]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" strokeWidth={2} />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related profiles ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-[#ebebeb] bg-white">
            <div className="mx-auto max-w-[1760px] px-6 py-12 sm:px-8">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">
                    Vous pourriez aussi contacter
                  </p>
                  <h2 className="text-[20px] font-bold tracking-[-0.015em] text-[#222222]">
                    Prestataires similaires
                  </h2>
                </div>
                <Link
                  href="/prestataires"
                  className="hidden items-center gap-1 text-[13px] font-semibold text-[#222222] hover:underline sm:flex"
                >
                  Voir tous
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p, i) => (
                  <PresataireCard key={p.slug} prestataire={p} priority={i < 2} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
