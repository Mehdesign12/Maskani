'use client'

import { useMemo, useState } from 'react'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  EyeOff,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatCard } from '@/components/admin/StatCard'
import { StatusPill } from '@/components/admin/StatusPill'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { Drawer } from '@/components/admin/Drawer'
import { TrendAreaChart } from '@/components/admin/charts/TrendAreaChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { SimpleBarChart } from '@/components/admin/charts/SimpleBarChart'
import {
  ADMIN_PRESTATAIRES,
  PRESTATAIRE_CATEGORY_LABELS,
  PRESTATAIRE_STATUS_LABELS,
} from '@/lib/admin/mock-prestataires'
import { ADMIN_REPORTS, ADMIN_REVIEWS, REPORT_STATUS_LABELS, REVIEW_STATUS_LABELS } from '@/lib/admin/mock-moderation'
import { CITY_STATS, MONTHLY_METRICS } from '@/lib/admin/mock-analytics'
import {
  PRESTATAIRE_STATUS_TONES,
  REPORT_STATUS_TONES,
  REVIEW_STATUS_TONES,
} from '@/lib/admin/status-colors'
import { formatCompactMAD, formatDate, formatNumber, formatRelativeTime } from '@/lib/admin/format'
import type {
  AdminPrestataire,
  AdminPrestataireStatus,
  AdminReport,
  AdminReview,
  ReportStatus,
  ReviewStatus,
} from '@/lib/admin/types'
import type { Availability, PresataireCategory } from '@/types/prestataire'

type Tab = 'annuaire' | 'avis' | 'analytics'

const TABS: { id: Tab; label: string }[] = [
  { id: 'annuaire', label: 'Annuaire' },
  { id: 'avis', label: 'Avis & Modération' },
  { id: 'analytics', label: 'Analytics' },
]

type StatusFilter = AdminPrestataireStatus | 'tous'
type CategoryFilter = PresataireCategory | 'tous'

const AVAILABILITY_META: Record<Availability, { dot: string; label: string }> = {
  disponible: { dot: 'bg-[#16A34A]', label: 'Disponible' },
  occupe: { dot: 'bg-[#B45309]', label: 'Occupé' },
  sur_rdv: { dot: 'bg-[#4F6AE8]', label: 'Sur RDV' },
}

function TabNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex w-full gap-1 overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white p-1.5">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTab(t.id)}
          className={[
            'flex-1 whitespace-nowrap rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-colors',
            tab === t.id ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:bg-[#f7f7f7]',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function AnnuaireTab() {
  const [prestataires, setPrestataires] = useState<AdminPrestataire[]>(ADMIN_PRESTATAIRES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('tous')
  const [active, setActive] = useState<AdminPrestataire | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return prestataires.filter((p) => {
      if (statusFilter !== 'tous' && p.status !== statusFilter) return false
      if (categoryFilter !== 'tous' && p.category !== categoryFilter) return false
      if (query && !p.name.toLowerCase().includes(query) && !p.city.toLowerCase().includes(query)) return false
      return true
    })
  }, [prestataires, search, statusFilter, categoryFilter])

  function setStatus(id: string, status: AdminPrestataireStatus) {
    setPrestataires((prev) => prev.map((p) => (p.id === id ? { ...p, status, isVerified: status === 'verifie' } : p)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status, isVerified: status === 'verifie' } : prev))
  }

  const columns: DataTableColumn<AdminPrestataire>[] = [
    {
      key: 'name',
      header: 'Prestataire',
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.avatar} alt={p.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{p.name}</p>
            <p className="truncate text-[12px] text-[#888888]">{p.title}</p>
          </div>
          {p.isPremium && <Crown className="h-3.5 w-3.5 shrink-0 text-[#D9BB9C]" />}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      sortValue: (p) => p.category,
      render: (p) => <span className="text-[13px] font-medium text-[#222222]">{PRESTATAIRE_CATEGORY_LABELS[p.category as PresataireCategory]}</span>,
    },
    {
      key: 'city',
      header: 'Ville',
      sortValue: (p) => p.city,
      render: (p) => (
        <div className="text-[13px]">
          <p className="font-medium text-[#222222]">{p.city}</p>
          <p className="text-[12px] text-[#888888]">{p.district}</p>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Note',
      align: 'right',
      sortValue: (p) => p.rating,
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          <Star className="h-3.5 w-3.5 fill-[#D9BB9C] text-[#D9BB9C]" /> {p.rating.toFixed(1)}
          <span className="text-[12px] font-normal text-[#888888]">({formatNumber(p.reviewCount)})</span>
        </span>
      ),
    },
    {
      key: 'availability',
      header: 'Disponibilité',
      sortValue: (p) => p.availability,
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6a6a6a]">
          <span className={`h-2 w-2 rounded-full ${AVAILABILITY_META[p.availability].dot}`} />
          {AVAILABILITY_META[p.availability].label}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (p) => p.status,
      render: (p) => <StatusPill label={PRESTATAIRE_STATUS_LABELS[p.status]} tone={PRESTATAIRE_STATUS_TONES[p.status]} />,
    },
    {
      key: 'leads',
      header: 'Leads',
      align: 'right',
      sortValue: (p) => p.leadsCount,
      render: (p) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(p.leadsCount)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Inscrit le',
      sortValue: (p) => p.createdAt,
      render: (p) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(p.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#ebebeb] bg-white p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-2">
          <Search className="h-4 w-4 text-[#b0b0b0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou ville..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les statuts</option>
          {Object.entries(PRESTATAIRE_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Toutes les catégories</option>
          {Object.entries(PRESTATAIRE_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} onRowClick={setActive} pageSize={10} />

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.name ?? ''}
        subtitle={active ? `${active.city} · ${active.district}` : undefined}
      >
        {active && (
          <div className="space-y-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.coverImage} alt={active.name} className="h-32 w-full rounded-[14px] object-cover" />

            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.avatar} alt={active.name} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-[#222222]">{active.name}</p>
                  {active.isVerified && <ShieldCheck className="h-4 w-4 text-[#4F6AE8]" />}
                  {active.isPremium && <Crown className="h-4 w-4 text-[#D9BB9C]" />}
                </div>
                <p className="mt-0.5 text-[12px] text-[#888888]">{active.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={PRESTATAIRE_STATUS_LABELS[active.status]} tone={PRESTATAIRE_STATUS_TONES[active.status]} />
              <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f7f7f7] px-2 py-0.5 text-[11px] font-semibold text-[#6a6a6a]">
                <span className={`h-2 w-2 rounded-full ${AVAILABILITY_META[active.availability].dot}`} />
                {AVAILABILITY_META[active.availability].label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Star className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{active.rating.toFixed(1)}</p>
                <p className="text-[11px] text-[#888888]">{formatNumber(active.reviewCount)} avis</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <TrendingUp className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.leadsCount)}</p>
                <p className="text-[11px] text-[#888888]">Leads</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Briefcase className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.completedProjects)}</p>
                <p className="text-[11px] text-[#888888]">Projets</p>
              </div>
            </div>

            <div className="space-y-2 rounded-[14px] border border-[#f3f3f3] p-4 text-[13px] text-[#6a6a6a]">
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-4 w-4 text-[#b0b0b0]" /> {PRESTATAIRE_CATEGORY_LABELS[active.category as PresataireCategory]}
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#b0b0b0]" /> {active.city} · {active.district}
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#b0b0b0]" /> Répond en {active.responseTime}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" /> Inscrit le {formatDate(active.createdAt)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {active.status !== 'verifie' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'verifie')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#16A34A] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" /> Vérifier
                </button>
              )}
              {active.status !== 'en_attente' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'en_attente')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[#dddddd] py-2.5 text-[13px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa]"
                >
                  <Clock className="h-4 w-4" /> Mettre en attente
                </button>
              )}
              {active.status !== 'suspendu' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'suspendu')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#DC2626] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <ShieldAlert className="h-4 w-4" /> Suspendre
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function ReportsBlock() {
  const [reports, setReports] = useState<AdminReport[]>(
    ADMIN_REPORTS.filter((r) => r.targetType === 'prestataire')
  )

  function setStatus(id: string, status: ReportStatus) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const columns: DataTableColumn<AdminReport>[] = [
    {
      key: 'target',
      header: 'Prestataire signalé',
      sortValue: (r) => r.targetLabel,
      render: (r) => <span className="text-[13px] font-semibold text-[#222222]">{r.targetLabel}</span>,
    },
    {
      key: 'reason',
      header: 'Motif',
      render: (r) => (
        <div className="text-[13px]">
          <p className="font-medium text-[#222222]">{r.reason}</p>
          <p className="mt-0.5 text-[12px] text-[#888888]">{r.details}</p>
        </div>
      ),
    },
    {
      key: 'reporter',
      header: 'Signalé par',
      sortValue: (r) => r.reporterName,
      render: (r) => <span className="text-[13px] text-[#6a6a6a]">{r.reporterName}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortValue: (r) => r.createdAt,
      render: (r) => <span className="text-[13px] text-[#6a6a6a]">{formatRelativeTime(r.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (r) => r.status,
      render: (r) => <StatusPill label={REPORT_STATUS_LABELS[r.status]} tone={REPORT_STATUS_TONES[r.status]} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={r.status === 'traite'}
            onClick={() => setStatus(r.id, 'traite')}
            className="rounded-[8px] bg-[#16A34A] px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Traiter
          </button>
          <button
            type="button"
            disabled={r.status === 'rejete'}
            onClick={() => setStatus(r.id, 'rejete')}
            className="rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Rejeter
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#DC2626]">
        <ShieldAlert className="h-4 w-4" />
        {reports.filter((r) => r.status === 'en_attente').length} signalement(s) en attente de traitement
      </div>
      <DataTable columns={columns} data={reports} rowKey={(r) => r.id} pageSize={5} />
    </div>
  )
}

function ReviewsBlock() {
  const [reviews, setReviews] = useState<AdminReview[]>(
    ADMIN_REVIEWS.filter((r) => r.targetType === 'prestataire')
  )

  function setStatus(id: string, status: ReviewStatus) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const columns: DataTableColumn<AdminReview>[] = [
    {
      key: 'target',
      header: 'Prestataire',
      sortValue: (r) => r.targetName,
      render: (r) => <span className="text-[13px] font-semibold text-[#222222]">{r.targetName}</span>,
    },
    {
      key: 'author',
      header: 'Auteur',
      sortValue: (r) => r.author,
      render: (r) => <span className="text-[13px] text-[#6a6a6a]">{r.author}</span>,
    },
    {
      key: 'rating',
      header: 'Note',
      align: 'right',
      sortValue: (r) => r.rating,
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          <Star className="h-3.5 w-3.5 fill-[#D9BB9C] text-[#D9BB9C]" /> {r.rating}
        </span>
      ),
    },
    {
      key: 'text',
      header: 'Avis',
      render: (r) => <p className="max-w-[320px] truncate text-[13px] text-[#6a6a6a]">{r.text}</p>,
    },
    {
      key: 'date',
      header: 'Date',
      sortValue: (r) => r.date,
      render: (r) => <span className="text-[13px] text-[#6a6a6a]">{r.date}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (r) => r.status,
      render: (r) => <StatusPill label={REVIEW_STATUS_LABELS[r.status]} tone={REVIEW_STATUS_TONES[r.status]} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          {r.status !== 'visible' && (
            <button
              type="button"
              onClick={() => setStatus(r.id, 'visible')}
              className="inline-flex items-center gap-1 rounded-[8px] bg-[#16A34A] px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Eye className="h-3.5 w-3.5" /> Afficher
            </button>
          )}
          {r.status !== 'masque' && (
            <button
              type="button"
              onClick={() => setStatus(r.id, 'masque')}
              className="inline-flex items-center gap-1 rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa]"
            >
              <EyeOff className="h-3.5 w-3.5" /> Masquer
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-[14px] border border-[#FFFBEB] bg-[#FFFBEB] px-4 py-3 text-[13px] text-[#B45309]">
        <MessageSquare className="h-4 w-4" />
        {reviews.filter((r) => r.status === 'signale').length} avis signalé(s) par la communauté
      </div>
      <DataTable columns={columns} data={reviews} rowKey={(r) => r.id} pageSize={8} />
    </div>
  )
}

function AvisModerationTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-[15px] font-bold text-[#222222]">Signalements</h3>
        <ReportsBlock />
      </div>
      <div>
        <h3 className="mb-3 text-[15px] font-bold text-[#222222]">Avis clients</h3>
        <ReviewsBlock />
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const statusBreakdown = useMemo(() => {
    const counts = new Map<AdminPrestataireStatus, number>()
    for (const p of ADMIN_PRESTATAIRES) {
      counts.set(p.status, (counts.get(p.status) ?? 0) + 1)
    }
    const colors: Record<AdminPrestataireStatus, string> = {
      verifie: '#16A34A',
      en_attente: '#B45309',
      suspendu: '#DC2626',
    }
    return Array.from(counts.entries()).map(([status, value]) => ({
      name: PRESTATAIRE_STATUS_LABELS[status],
      value,
      color: colors[status],
    }))
  }, [])

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of ADMIN_PRESTATAIRES) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category: PRESTATAIRE_CATEGORY_LABELS[category as PresataireCategory] ?? category, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  const topCities = CITY_STATS.filter((c) => c.prestataires > 0)
    .slice(0, 6)
    .map((c) => ({ city: c.city, prestataires: c.prestataires }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Revenu Prestataires</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Évolution sur les 12 derniers mois</p>
          <TrendAreaChart
            data={MONTHLY_METRICS}
            xKey="month"
            series={[{ key: 'revenuPrestataires', label: 'Revenu', color: '#4F6AE8' }]}
            valueFormatter={formatCompactMAD}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Répartition par statut</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">{ADMIN_PRESTATAIRES.length} prestataires au total</p>
          <DonutChart data={statusBreakdown} height={180} />
          <div className="mt-4 space-y-2">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#6a6a6a]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#222222]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Prestataires par catégorie</h3>
          <SimpleBarChart
            data={categoryBreakdown}
            xKey="category"
            series={[{ key: 'count', label: 'Prestataires', color: '#4F6AE8' }]}
            height={260}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Top villes par prestataires</h3>
          <SimpleBarChart
            data={topCities}
            xKey="city"
            series={[{ key: 'prestataires', label: 'Prestataires', color: '#D9BB9C' }]}
            horizontal
            height={260}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminPrestatairesPage() {
  const [tab, setTab] = useState<Tab>('annuaire')

  const total = ADMIN_PRESTATAIRES.length
  const verifies = ADMIN_PRESTATAIRES.filter((p) => p.status === 'verifie').length
  const enAttente = ADMIN_PRESTATAIRES.filter((p) => p.status === 'en_attente').length
  const avgRating = total > 0 ? (ADMIN_PRESTATAIRES.reduce((sum, p) => sum + p.rating, 0) / total).toFixed(1) : '0.0'
  const totalLeads = ADMIN_PRESTATAIRES.reduce((sum, p) => sum + p.leadsCount, 0)

  return (
    <div className="space-y-5">
      <SectionHeader title="Prestataires" description="Gérez l'annuaire des prestataires, les avis et les signalements" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total prestataires" value={formatNumber(total)} icon={Users} accent="#4F6AE8" />
        <StatCard label="Vérifiés" value={formatNumber(verifies)} icon={ShieldCheck} accent="#16A34A" />
        <StatCard label="En attente" value={formatNumber(enAttente)} icon={Clock} accent="#B45309" />
        <StatCard label="Note moyenne" value={`${avgRating}/5`} icon={Star} accent="#D9BB9C" />
        <StatCard label="Leads cumulés" value={formatNumber(totalLeads)} icon={TrendingUp} accent="#7C3AED" />
      </div>

      <TabNav tab={tab} setTab={setTab} />

      {tab === 'annuaire' && <AnnuaireTab />}
      {tab === 'avis' && <AvisModerationTab />}
      {tab === 'analytics' && <AnalyticsTab />}
    </div>
  )
}
