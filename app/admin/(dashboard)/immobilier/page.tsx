'use client'

import { useMemo, useState } from 'react'
import {
  Archive,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  XCircle,
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
  ADMIN_AGENCIES,
  ADMIN_LISTINGS,
  LISTING_STATUS_LABELS,
  TYPE_LABELS,
  TYPES,
} from '@/lib/admin/mock-immobilier'
import { ADMIN_REPORTS, REPORT_STATUS_LABELS } from '@/lib/admin/mock-moderation'
import { CITY_STATS, MONTHLY_METRICS } from '@/lib/admin/mock-analytics'
import { LISTING_STATUS_TONES, REPORT_STATUS_TONES, SUBSCRIPTION_LABELS, SUBSCRIPTION_TONES } from '@/lib/admin/status-colors'
import { formatCompactMAD, formatDate, formatNumber, formatPriceFromCentimes, formatRelativeTime } from '@/lib/admin/format'
import type { AdminAgency, AdminListing, AdminListingStatus, ReportStatus } from '@/lib/admin/types'
import type { AdminReport } from '@/lib/admin/types'

type Tab = 'annonces' | 'moderation' | 'agences' | 'analytics'

const TABS: { id: Tab; label: string }[] = [
  { id: 'annonces', label: 'Annonces' },
  { id: 'moderation', label: 'Modération' },
  { id: 'agences', label: 'Agences' },
  { id: 'analytics', label: 'Analytics' },
]

type StatusFilter = AdminListingStatus | 'tous'
type TypeFilter = (typeof TYPES)[number] | 'tous'
type TransactionFilter = 'vente' | 'location' | 'tous'

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

function AnnoncesTab() {
  const [listings, setListings] = useState<AdminListing[]>(ADMIN_LISTINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('tous')
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('tous')
  const [active, setActive] = useState<AdminListing | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return listings.filter((l) => {
      if (statusFilter !== 'tous' && l.status !== statusFilter) return false
      if (typeFilter !== 'tous' && l.type !== typeFilter) return false
      if (transactionFilter !== 'tous' && l.transaction !== transactionFilter) return false
      if (query && !l.title.toLowerCase().includes(query) && !l.city.toLowerCase().includes(query)) return false
      return true
    })
  }, [listings, search, statusFilter, typeFilter, transactionFilter])

  function setStatus(id: string, status: AdminListingStatus) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status, rejectionReason: status === 'refusee' ? l.rejectionReason ?? 'Non conforme aux standards Maskani' : undefined } : l)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status, rejectionReason: status === 'refusee' ? prev.rejectionReason ?? 'Non conforme aux standards Maskani' : undefined } : prev))
  }

  const columns: DataTableColumn<AdminListing>[] = [
    {
      key: 'title',
      header: 'Annonce',
      sortValue: (l) => l.title,
      render: (l) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.imageUrl} alt={l.title} className="h-10 w-14 shrink-0 rounded-[8px] object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{l.title}</p>
            <p className="truncate text-[12px] text-[#888888]">
              {l.city}
              {l.district ? ` · ${l.district}` : ''}
            </p>
          </div>
          {l.isPremium && <Crown className="h-3.5 w-3.5 shrink-0 text-[#D9BB9C]" />}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortValue: (l) => l.type,
      render: (l) => (
        <div className="text-[13px]">
          <p className="font-medium text-[#222222]">{TYPE_LABELS[l.type] ?? l.type}</p>
          <p className="text-[12px] text-[#888888]">{l.transaction === 'vente' ? 'Vente' : 'Location'}</p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Prix',
      align: 'right',
      sortValue: (l) => l.price,
      render: (l) => <span className="text-[13px] font-semibold text-[#222222]">{formatPriceFromCentimes(l.price)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (l) => l.status,
      render: (l) => <StatusPill label={LISTING_STATUS_LABELS[l.status]} tone={LISTING_STATUS_TONES[l.status]} />,
    },
    {
      key: 'performance',
      header: 'Performance',
      render: (l) => (
        <div className="flex items-center gap-3 text-[12px] text-[#888888]">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {formatNumber(l.views)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" /> {formatNumber(l.contacts)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" /> {formatNumber(l.favorites)}
          </span>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Propriétaire',
      sortValue: (l) => l.ownerName,
      render: (l) => (
        <div className="text-[13px]">
          <p className="font-medium text-[#222222]">{l.ownerName}</p>
          {l.agency && <p className="text-[12px] text-[#888888]">{l.agency}</p>}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Publiée le',
      sortValue: (l) => l.createdAt,
      render: (l) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(l.createdAt)}</span>,
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
            placeholder="Rechercher par titre ou ville..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les statuts</option>
          {Object.entries(LISTING_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les types</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <select
          value={transactionFilter}
          onChange={(e) => setTransactionFilter(e.target.value as TransactionFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Vente & location</option>
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} rowKey={(l) => l.id} onRowClick={setActive} pageSize={10} />

      <Drawer
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title ?? ''}
        subtitle={active ? `${active.city}${active.district ? ` · ${active.district}` : ''}` : undefined}
      >
        {active && (
          <div className="space-y-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.imageUrl} alt={active.title} className="h-44 w-full rounded-[14px] object-cover" />

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={LISTING_STATUS_LABELS[active.status]} tone={LISTING_STATUS_TONES[active.status]} />
              {active.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4F6AE8]">
                  <ShieldCheck className="h-3 w-3" /> Vérifiée
                </span>
              )}
              {active.isPremium && (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
              {active.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#F5F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
                  <Star className="h-3 w-3" /> Mise en avant
                </span>
              )}
            </div>

            {active.status === 'refusee' && active.rejectionReason && (
              <div className="rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-[13px] text-[#DC2626]">
                <span className="font-semibold">Motif du refus : </span>
                {active.rejectionReason}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Type</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{TYPE_LABELS[active.type] ?? active.type}</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Transaction</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{active.transaction === 'vente' ? 'Vente' : 'Location'}</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Prix</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{formatPriceFromCentimes(active.price)}</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Surface</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{active.area ? `${active.area} m²` : '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Eye className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.views)}</p>
                <p className="text-[11px] text-[#888888]">Vues</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <MessageCircle className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.contacts)}</p>
                <p className="text-[11px] text-[#888888]">Contacts</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Heart className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.favorites)}</p>
                <p className="text-[11px] text-[#888888]">Favoris</p>
              </div>
            </div>

            <div className="space-y-2 rounded-[14px] border border-[#f3f3f3] p-4 text-[13px] text-[#6a6a6a]">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-[#b0b0b0]" />
                {active.ownerName}
                {active.agency ? ` · ${active.agency}` : ''}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" />
                Publiée le {formatDate(active.createdAt)} · mise à jour {formatRelativeTime(active.updatedAt)}
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="h-4 w-4 text-[#b0b0b0]" />
                Score qualité : {active.qualityScore}/100
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {active.status !== 'publiee' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'publiee')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#16A34A] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" /> Publier
                </button>
              )}
              {active.status !== 'refusee' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'refusee')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#DC2626] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <XCircle className="h-4 w-4" /> Refuser
                </button>
              )}
              {active.status !== 'archivee' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'archivee')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[#dddddd] py-2.5 text-[13px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa]"
                >
                  <Archive className="h-4 w-4" /> Archiver
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function ModerationTab() {
  const [reports, setReports] = useState<AdminReport[]>(ADMIN_REPORTS.filter((r) => r.targetType === 'annonce'))

  function setStatus(id: string, status: ReportStatus) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const columns: DataTableColumn<AdminReport>[] = [
    {
      key: 'target',
      header: 'Annonce signalée',
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#DC2626]">
        <ShieldAlert className="h-4 w-4" />
        {reports.filter((r) => r.status === 'en_attente').length} signalement(s) en attente de traitement
      </div>
      <DataTable columns={columns} data={reports} rowKey={(r) => r.id} pageSize={10} />
    </div>
  )
}

function AgencesTab() {
  const [active, setActive] = useState<AdminAgency | null>(null)

  const columns: DataTableColumn<AdminAgency>[] = [
    {
      key: 'name',
      header: 'Agence',
      sortValue: (a) => a.name,
      render: (a) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.logo} alt={a.name} className="h-9 w-9 rounded-[8px] object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{a.name}</p>
            <p className="truncate text-[12px] text-[#888888]">{a.city}</p>
          </div>
          {a.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#4F6AE8]" />}
        </div>
      ),
    },
    {
      key: 'subscription',
      header: 'Abonnement',
      sortValue: (a) => a.subscription,
      render: (a) => <StatusPill label={SUBSCRIPTION_LABELS[a.subscription]} tone={SUBSCRIPTION_TONES[a.subscription]} />,
    },
    {
      key: 'listings',
      header: 'Annonces',
      align: 'right',
      sortValue: (a) => a.listingsCount,
      render: (a) => <span className="text-[13px] font-semibold text-[#222222]">{formatNumber(a.listingsCount)}</span>,
    },
    {
      key: 'rating',
      header: 'Note',
      align: 'right',
      sortValue: (a) => a.rating,
      render: (a) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          <Star className="h-3.5 w-3.5 fill-[#D9BB9C] text-[#D9BB9C]" /> {a.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'leads',
      header: 'Leads',
      align: 'right',
      sortValue: (a) => a.leadsCount,
      render: (a) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(a.leadsCount)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Inscrite le',
      sortValue: (a) => a.createdAt,
      render: (a) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(a.createdAt)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={ADMIN_AGENCIES} rowKey={(a) => a.id} onRowClick={setActive} pageSize={10} />

      <Drawer open={!!active} onClose={() => setActive(null)} title={active?.name ?? ''} subtitle={active?.city}>
        {active && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.logo} alt={active.name} className="h-16 w-16 rounded-[14px] object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-[#222222]">{active.name}</p>
                  {active.isVerified && <BadgeCheck className="h-4 w-4 text-[#4F6AE8]" />}
                </div>
                <p className="mt-1 text-[12px] text-[#888888]">{active.ownerName}</p>
              </div>
            </div>

            <StatusPill label={SUBSCRIPTION_LABELS[active.subscription]} tone={SUBSCRIPTION_TONES[active.subscription]} />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{formatNumber(active.listingsCount)}</p>
                <p className="text-[11px] text-[#888888]">Annonces</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{active.rating.toFixed(1)}</p>
                <p className="text-[11px] text-[#888888]">Note ({formatNumber(active.reviewsCount)})</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{formatNumber(active.leadsCount)}</p>
                <p className="text-[11px] text-[#888888]">Leads</p>
              </div>
            </div>

            <div className="space-y-2 rounded-[14px] border border-[#f3f3f3] p-4 text-[13px] text-[#6a6a6a]">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#b0b0b0]" /> {active.city}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" /> Membre depuis le {formatDate(active.createdAt)}
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-[#b0b0b0]" /> {active.ownerEmail} · {active.phone}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function AnalyticsTab() {
  const statusBreakdown = useMemo(() => {
    const counts = new Map<AdminListingStatus, number>()
    for (const listing of ADMIN_LISTINGS) {
      counts.set(listing.status, (counts.get(listing.status) ?? 0) + 1)
    }
    const colors: Record<AdminListingStatus, string> = {
      publiee: '#16A34A',
      en_attente: '#B45309',
      refusee: '#DC2626',
      vendue: '#4F6AE8',
      louee: '#7C3AED',
      archivee: '#b0b0b0',
    }
    return Array.from(counts.entries()).map(([status, value]) => ({
      name: LISTING_STATUS_LABELS[status],
      value,
      color: colors[status],
    }))
  }, [])

  const typeBreakdown = useMemo(() => {
    const counts = new Map<string, number>()
    for (const listing of ADMIN_LISTINGS) {
      counts.set(listing.type, (counts.get(listing.type) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type: TYPE_LABELS[type] ?? type, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  const topCities = CITY_STATS.slice(0, 6).map((c) => ({ city: c.city, listings: c.listings }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Revenu Immobilier</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Évolution sur les 12 derniers mois</p>
          <TrendAreaChart
            data={MONTHLY_METRICS}
            xKey="month"
            series={[{ key: 'revenuImmobilier', label: 'Revenu', color: '#B19272' }]}
            valueFormatter={formatCompactMAD}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Répartition par statut</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">{ADMIN_LISTINGS.length} annonces au total</p>
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
          <h3 className="text-[15px] font-bold text-[#222222]">Annonces par type de bien</h3>
          <SimpleBarChart
            data={typeBreakdown}
            xKey="type"
            series={[{ key: 'count', label: 'Annonces', color: '#B19272' }]}
            height={260}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Top villes par annonces</h3>
          <SimpleBarChart
            data={topCities}
            xKey="city"
            series={[{ key: 'listings', label: 'Annonces', color: '#D9BB9C' }]}
            horizontal
            height={260}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminImmobilierPage() {
  const [tab, setTab] = useState<Tab>('annonces')

  const total = ADMIN_LISTINGS.length
  const publiees = ADMIN_LISTINGS.filter((l) => l.status === 'publiee').length
  const enAttente = ADMIN_LISTINGS.filter((l) => l.status === 'en_attente').length
  const conclues = ADMIN_LISTINGS.filter((l) => l.status === 'vendue' || l.status === 'louee').length
  const avgQuality = Math.round(ADMIN_LISTINGS.reduce((sum, l) => sum + l.qualityScore, 0) / total)

  return (
    <div className="space-y-5">
      <SectionHeader title="Immobilier" description="Gérez les annonces, la modération et les agences partenaires" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total annonces" value={formatNumber(total)} icon={Building2} accent="#B19272" />
        <StatCard label="Publiées" value={formatNumber(publiees)} icon={CheckCircle2} accent="#16A34A" />
        <StatCard label="En attente" value={formatNumber(enAttente)} icon={Clock} accent="#B45309" />
        <StatCard label="Vendues / Louées" value={formatNumber(conclues)} icon={ShieldCheck} accent="#4F6AE8" />
        <StatCard label="Score qualité moyen" value={`${avgQuality}/100`} icon={Star} accent="#7C3AED" />
      </div>

      <TabNav tab={tab} setTab={setTab} />

      {tab === 'annonces' && <AnnoncesTab />}
      {tab === 'moderation' && <ModerationTab />}
      {tab === 'agences' && <AgencesTab />}
      {tab === 'analytics' && <AnalyticsTab />}
    </div>
  )
}
