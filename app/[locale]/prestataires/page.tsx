import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Camera,
  CheckSquare,
  Hammer,
  Scale,
  Shield,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PresatairesDirectory } from '@/components/prestataire/PresatairesDirectory'
import { getPresataireCardData } from '@/lib/prestataires'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Prestataires immobiliers — Notaires, Agents, Architectes | Maskani',
  description:
    "Trouvez le meilleur professionnel de l'immobilier au Maroc. Notaires, agents, architectes, entrepreneurs, diagnostiqueurs et plus — tous vérifiés Maskani.",
}

const CATEGORY_HIGHLIGHTS = [
  { icon: Scale,       label: 'Notaires',       count: '42 pros',  color: 'bg-[#FEF3C7] text-[#92400E]' },
  { icon: Building2,   label: 'Agents',          count: '186 pros', color: 'bg-[#DBEAFE] text-[#1E40AF]' },
  { icon: Users,       label: 'Architectes',     count: '67 pros',  color: 'bg-[#E0E7FF] text-[#3730A3]' },
  { icon: Hammer,      label: 'Travaux',         count: '213 pros', color: 'bg-[#FFE4E6] text-[#9F1239]' },
  { icon: CheckSquare, label: 'Diagnostics',     count: '38 pros',  color: 'bg-[#EDE9FE] text-[#5B21B6]' },
  { icon: Briefcase,   label: 'Avocats',         count: '29 pros',  color: 'bg-[#F1F5F9] text-[#334155]' },
  { icon: Camera,      label: 'Photographes',    count: '54 pros',  color: 'bg-[#FCE7F3] text-[#9D174D]' },
  { icon: Truck,       label: 'Déménageurs',     count: '31 pros',  color: 'bg-[#D1FAE5] text-[#065F46]' },
]

const TRUST_POINTS = [
  {
    icon: BadgeCheck,
    title: 'Vérifiés Maskani',
    text: 'Chaque prestataire est contrôlé : diplômes, assurances, avis clients et historique de projets.',
  },
  {
    icon: Star,
    title: 'Avis authentiques',
    text: 'Seuls les clients ayant réellement travaillé avec un professionnel peuvent laisser un avis.',
  },
  {
    icon: Zap,
    title: 'Réponse garantie',
    text: 'Tous nos prestataires s\'engagent à répondre dans les délais affichés sur leur profil.',
  },
]

export default async function PresatairesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const profiles = getPresataireCardData()

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#222222]">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[#ebebeb] bg-white">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(79,106,232,0.07),transparent_70%)]" />

          <div className="relative mx-auto max-w-[1760px] px-6 pb-14 pt-14 lg:pb-20 lg:pt-16">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#222222] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F6AE8]" />
                500+ professionnels vérifiés Maskani
              </div>

              <h1 className="text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#222222] sm:text-[54px]">
                Faites confiance aux<br className="hidden sm:block" /> meilleurs professionnels.
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.6] text-[#6a6a6a]">
                Notaires, agents, architectes, entrepreneurs, avocats — tous vérifiés, notés et disponibles au Maroc.
              </p>

              {/* Avatars social proof */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    'photo-1573496359142-b8d87734a5a2',
                    'photo-1507003211169-0a1dd7228f2d',
                    'photo-1580489944761-15a19d654956',
                    'photo-1560250097-0b93528c311a',
                    'photo-1472099645785-5658abf4ff4e',
                  ].map((id, i) => (
                    <div key={id} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#ebebeb]" style={{ zIndex: 5 - i }}>
                      <Image
                        src={`https://images.unsplash.com/${id}?w=80&h=80&fit=crop&crop=face`}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-[12px] text-[#6a6a6a]">
                    <span className="font-semibold text-[#222222]">4,8/5</span> · Plus de 8 400 avis clients
                  </p>
                </div>
              </div>
            </div>

            {/* Category pills highlight */}
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {CATEGORY_HIGHLIGHTS.map(({ icon: Icon, label, count, color }) => (
                <div key={label} className="flex flex-col items-center gap-2 rounded-[16px] border border-[#ebebeb] bg-white p-4 text-center transition-colors hover:border-[#c8c8c8]">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.split(' ')[0]}`}>
                    <Icon className={`h-5 w-5 ${color.split(' ')[1]}`} strokeWidth={1.7} />
                  </div>
                  <p className="text-[12px] font-semibold text-[#222222]">{label}</p>
                  <p className="text-[11px] text-[#aaaaaa]">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Directory (client component: chips + city + grid) ────────── */}
        <div className="mx-auto max-w-[1760px] px-0 py-10 lg:px-0">
          <div className="mb-8 flex items-end justify-between gap-6 px-6">
            <div>
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">
                Annuaire vérifié
              </p>
              <h2 className="text-[22px] font-bold tracking-[-0.009em] text-[#222222]">
                Nos prestataires
              </h2>
            </div>
          </div>
          <PresatairesDirectory profiles={profiles} />
        </div>

        {/* ── Trust signals ─────────────────────────────────────────────── */}
        <section className="border-y border-[#ebebeb] bg-white">
          <div className="mx-auto grid max-w-[1760px] gap-8 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6a6a6a]">
                Pourquoi Maskani Pros
              </p>
              <h2 className="max-w-sm text-[26px] font-bold leading-[1.12] tracking-[-0.025em] text-[#222222]">
                Des professionnels sélectionnés, pas juste listés.
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-[1.6] text-[#6a6a6a]">
                Avant d&apos;apparaître sur Maskani, chaque prestataire passe par un processus de vérification : diplômes, assurances professionnelles, historique de projets et contrôle des avis. Pas de faux profils, pas de fake avis.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[20px] bg-[#f7f7f7] p-6 transition-colors hover:bg-[#f0f0f0]">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4F6AE8] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[14px] font-bold tracking-[-0.009em] text-[#222222]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.55] text-[#6a6a6a]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pro CTA ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1760px] px-6 py-14">
          <div className="overflow-hidden rounded-[20px] bg-[#222222] text-white">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-[32px] bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/80">
                  <Shield className="h-3.5 w-3.5" />
                  Espace Professionnels
                </div>
                <h2 className="max-w-xl text-[26px] font-bold leading-[1.12] tracking-[-0.025em] sm:text-[32px]">
                  Vous êtes un professionnel de l&apos;immobilier ?
                </h2>
              </div>
              <div className="flex flex-col gap-5 lg:items-end">
                <p className="max-w-xl text-[14px] leading-[1.6] text-white/65 lg:text-end">
                  Rejoignez Maskani Pros et accédez à des clients qualifiés qui cherchent exactement votre expertise. Profil vérifié, visibilité premium, leads sérieux.
                </p>
                <Link
                  href="/inscription"
                  className="inline-flex w-fit items-center rounded-[8px] bg-[#4F6AE8] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#4058cc]"
                >
                  Rejoindre Maskani Pros
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
