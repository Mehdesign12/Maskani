'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Eye,
  EyeOff,
  Handshake,
  Lock,
  Mail,
  ShieldCheck,
  Sofa,
} from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Building2, label: 'Immobilier', color: '#B19272' },
  { icon: Sofa, label: 'Ameublement', color: '#16A34A' },
  { icon: Handshake, label: 'Prestataires', color: '#4F6AE8' },
  { icon: BarChart3, label: 'Analytics', color: '#D9BB9C' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@maskani.ma')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/admin'), 500)
  }

  return (
    <div className="flex min-h-screen">
      {/* Branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1c1c1c] p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#D9BB9C] opacity-20 blur-3xl" />
          <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#4F6AE8] opacity-15 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/4 h-72 w-72 rounded-full bg-[#16A34A] opacity-15 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#D9BB9C] text-[16px] font-bold text-[#222222]">
            M
          </div>
          <p className="text-[16px] font-bold text-white">Maskani</p>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-[32px] border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-[#D9BB9C]">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
            Connexion ModPass
          </div>
          <h1 className="text-[34px] font-bold leading-[1.18] tracking-[-0.02em] text-white">
            Le back-office unique pour piloter toute la plateforme Maskani.
          </h1>
          <p className="mt-4 text-[14px] leading-[1.43] text-[#aaaaaa]">
            Utilisateurs, annonces immobilières, catalogue ameublement, prestataires et analytics —
            tout est centralisé dans un seul espace de gestion.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-[14px] border border-white/10 bg-white/[0.03] px-3.5 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${color}26` }}>
                  <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
                </div>
                <span className="text-[13px] font-medium text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[12px] text-[#777777]">© 2026 Maskani — Espace réservé aux administrateurs</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#D9BB9C] text-[15px] font-bold text-[#222222]">
              M
            </div>
            <p className="text-[15px] font-bold text-[#222222]">Maskani Admin</p>
          </div>

          <div className="mb-1 inline-flex items-center gap-1.5 rounded-[4px] bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-[#16A34A]">
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            MODPASS
          </div>
          <h2 className="text-[28px] font-bold leading-[1.18] tracking-[-0.02em] text-[#222222]">Connexion administrateur</h2>
          <p className="mt-2 text-[13px] text-[#6a6a6a]">
            Accédez au tableau de bord de gestion de Maskani.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b0b0]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maskani.ma"
                  className="w-full rounded-[14px] border border-[#dddddd] bg-white py-3 pl-10 pr-4 text-[14px] text-[#222222] outline-none transition-colors focus:border-[#B19272]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b0b0]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full rounded-[14px] border border-[#dddddd] bg-white py-3 pl-10 pr-11 text-[14px] text-[#222222] outline-none transition-colors focus:border-[#B19272]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b0b0b0] transition-colors hover:text-[#6a6a6a]"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <label className="flex items-center gap-2 text-[#6a6a6a]">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#dddddd] accent-[#B19272]" />
                Se souvenir de moi
              </label>
              <span className="font-semibold text-[#B19272]">Mot de passe oublié ?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#222222] py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-[#b0b0b0]">
            Aperçu de design — aucune authentification réelle n&apos;est effectuée.
          </p>
        </div>
      </div>
    </div>
  )
}
