import { Link } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { Menu } from 'lucide-react'

export async function Navbar() {
  const locale = await getLocale()

  const navLinks = [
    { href: '/annonces?transaction=vente' as const, label: locale === 'ar' ? 'شراء' : 'Acheter' },
    { href: '/annonces?transaction=location' as const, label: locale === 'ar' ? 'إيجار' : 'Louer' },
    { href: '/projets-neufs' as const, label: locale === 'ar' ? 'مشاريع جديدة' : 'Projets neufs' },
    { href: '/agences' as const, label: locale === 'ar' ? 'الوكالات' : 'Agences' },
    { href: '/estimation' as const, label: locale === 'ar' ? 'التقييم' : 'Estimation IA' },
  ]

  return (
    <header className="sticky top-0 z-50 h-20 bg-white border-b border-[#ebebeb]">
      <div
        className="max-w-[1760px] mx-auto px-6 h-full flex items-center justify-between gap-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-9 h-9 bg-[#E05C1A] rounded-[10px] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[16px]">م</span>
          </div>
          <span className="text-[20px] font-bold text-[#222222] tracking-[-0.02em]">
            maskani
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3.5 py-2 text-[14px] font-semibold text-[#222222] rounded-[8px] hover:bg-[#f7f7f7] transition-colors duration-150 whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language toggle */}
          <Link
            href="/"
            locale={locale === 'fr' ? 'ar' : 'fr'}
            className="hidden sm:flex items-center px-3 py-1.5 rounded-[32px] border border-[#ebebeb] text-[12px] font-semibold text-[#222222] hover:bg-[#f7f7f7] transition-colors"
          >
            {locale === 'fr' ? 'عربي' : 'FR'}
          </Link>

          <Link
            href="/connexion"
            className="hidden sm:block px-4 py-2 text-[14px] font-semibold text-[#222222] rounded-[8px] hover:bg-[#f7f7f7] transition-colors"
          >
            {locale === 'ar' ? 'دخول' : 'Connexion'}
          </Link>

          <Link
            href="/inscription"
            className="px-4 py-2 text-[14px] font-semibold text-white bg-[#E05C1A] rounded-[8px] hover:bg-[#B84A12] transition-colors whitespace-nowrap"
          >
            {locale === 'ar' ? 'تسجيل' : "S'inscrire"}
          </Link>

          {/* Mobile menu icon */}
          <button className="lg:hidden p-2 rounded-[8px] hover:bg-[#f7f7f7] transition-colors ms-1">
            <Menu className="w-5 h-5 text-[#222222]" />
          </button>
        </div>
      </div>
    </header>
  )
}
