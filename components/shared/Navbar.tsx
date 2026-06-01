import { getLocale } from 'next-intl/server'
import { Menu } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function Navbar() {
  const locale = await getLocale()

  const navLinks = [
    { href: '/annonces?transaction=vente' as const, label: locale === 'ar' ? 'شراء' : 'Acheter' },
    { href: '/annonces?transaction=location' as const, label: locale === 'ar' ? 'إيجار' : 'Louer' },
    { href: '/projets-neufs' as const, label: locale === 'ar' ? 'مشاريع جديدة' : 'Projets neufs' },
    { href: '/agences' as const, label: locale === 'ar' ? 'الوكالات' : 'Agences' },
    { href: '/marche' as const, label: locale === 'ar' ? 'السوق' : 'Prix du marché' },
  ]

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-[#ebebeb] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Maskani">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E05C1A] shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)]">
            <span className="text-[16px] font-bold text-white">م</span>
          </div>
          <span className="text-[20px] font-bold tracking-[-0.02em] text-[#222222]">maskani</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[32px] px-4 py-2 text-[14px] font-semibold text-[#222222] transition-colors duration-150 hover:bg-[#f7f7f7]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/"
            locale={locale === 'fr' ? 'ar' : 'fr'}
            className="hidden items-center rounded-[32px] border border-[#ebebeb] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:border-[#222222] sm:flex"
          >
            {locale === 'fr' ? 'عربي' : 'FR'}
          </Link>

          <Link
            href="/connexion"
            className="hidden rounded-[32px] px-4 py-2 text-[14px] font-semibold text-[#222222] transition-colors hover:bg-[#f7f7f7] sm:block"
          >
            {locale === 'ar' ? 'دخول' : 'Connexion'}
          </Link>

          <Link
            href="/inscription"
            className="rounded-[8px] bg-[#E05C1A] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#B84A12] whitespace-nowrap"
          >
            {locale === 'ar' ? 'نشر إعلان' : 'Publier'}
          </Link>

          <button className="ms-1 rounded-[8px] p-2 transition-colors hover:bg-[#f7f7f7] lg:hidden" aria-label="Menu">
            <Menu className="h-5 w-5 text-[#222222]" />
          </button>
        </div>
      </div>
    </header>
  )
}
