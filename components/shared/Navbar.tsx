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
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Maskani">
          <svg width="32" height="40" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navbar-logo-grad" x1="0" y1="0" x2="36" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D9BB9C"/>
                <stop offset="1" stopColor="#B19272"/>
              </linearGradient>
            </defs>
            <path d="M2 43 L2 24 C2 12 10 1 18 1 C26 1 34 12 34 24 L34 43 Z" fill="url(#navbar-logo-grad)"/>
            <path d="M7 39 L7 26 C7 17 12 9 18 9 C24 9 29 17 29 26 L29 39 Z" fill="white"/>
            <path d="M18 28 L21 33 L18 38 L15 33 Z" fill="url(#navbar-logo-grad)"/>
          </svg>
          <span className="bg-gradient-to-br from-[#D9BB9C] to-[#B19272] bg-clip-text text-[22px] font-bold tracking-[-0.02em] text-transparent">
            Maskani
          </span>
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
            className="rounded-[8px] bg-[#B19272] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#9a7d61] whitespace-nowrap"
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
