'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Menu, Search, X } from 'lucide-react'
import { Sidebar } from './Sidebar'

const PAGE_TITLES: { href: string; title: string }[] = [
  { href: '/admin/utilisateurs', title: 'Utilisateurs' },
  { href: '/admin/immobilier', title: 'Immobilier' },
  { href: '/admin/ameublement', title: 'Ameublement' },
  { href: '/admin/prestataires', title: 'Prestataires' },
  { href: '/admin/moderation', title: 'Modération' },
  { href: '/admin/analytics', title: 'Analytics' },
  { href: '/admin/parametres', title: 'Paramètres' },
  { href: '/admin', title: 'Tableau de bord' },
]

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const title = PAGE_TITLES.find((p) => pathname.startsWith(p.href))?.title ?? 'Tableau de bord'

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#ebebeb] bg-white/80 px-4 py-3 backdrop-blur-sm lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ebebeb] lg:hidden"
          >
            <Menu className="h-4 w-4 text-[#222222]" />
          </button>
          <h1 className="text-[18px] font-bold leading-[1.25] tracking-[-0.009em] text-[#222222]">{title}</h1>
        </div>

        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-[#b0b0b0]" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#ebebeb] text-[#222222]">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
          </button>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=12" alt="Admin" className="h-9 w-9 rounded-full object-cover" />
            <div className="hidden text-left lg:block">
              <p className="text-[13px] font-semibold text-[#222222]">Admin Maskani</p>
              <p className="text-[11px] text-[#888888]">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white"
          >
            <X className="h-4 w-4 text-[#222222]" />
          </button>
        </div>
      )}
    </>
  )
}
