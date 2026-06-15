'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Building2,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Sofa,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, color: '#D9BB9C' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users, color: '#888888' },
  { href: '/admin/immobilier', label: 'Immobilier', icon: Building2, color: '#B19272' },
  { href: '/admin/ameublement', label: 'Ameublement', icon: Sofa, color: '#16A34A' },
  { href: '/admin/prestataires', label: 'Prestataires', icon: Handshake, color: '#4F6AE8' },
  { href: '/admin/moderation', label: 'Modération', icon: ShieldAlert, color: '#DC2626' },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: '#7C3AED' },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings, color: '#888888' },
] as const

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col bg-[#1c1c1c]">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#D9BB9C] text-[15px] font-bold text-[#222222]">
          M
        </div>
        <div>
          <p className="text-[14px] font-bold leading-tight text-white">Maskani</p>
          <p className="text-[11px] font-medium text-[#888888]">ModPass Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors',
                active ? 'bg-white/10 text-white' : 'text-[#aaaaaa] hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" style={{ color: active ? item.color : undefined }} strokeWidth={1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[#aaaaaa] transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4 w-4" strokeWidth={1.8} />
          Voir le site
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium text-[#aaaaaa] transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          Déconnexion
        </Link>
      </div>
    </aside>
  )
}
