'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Eye,
  EyeOff,
  MessageSquare,
  Search,
  ShieldAlert,
  Star,
  XCircle,
} from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatCard } from '@/components/admin/StatCard'
import { StatusPill } from '@/components/admin/StatusPill'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import {
  ADMIN_REPORTS,
  ADMIN_REVIEWS,
  REPORT_STATUS_LABELS,
  REPORT_TYPE_LABELS,
  REVIEW_STATUS_LABELS,
} from '@/lib/admin/mock-moderation'
import { REPORT_STATUS_TONES, REVIEW_STATUS_TONES } from '@/lib/admin/status-colors'
import { formatRelativeTime } from '@/lib/admin/format'
import type {
  AdminReport,
  AdminReview,
  ReportStatus,
  ReportTargetType,
  ReviewStatus,
  ReviewTargetType,
} from '@/lib/admin/types'

type Tab = 'signalements' | 'avis'

const TABS: { id: Tab; label: string }[] = [
  { id: 'signalements', label: 'Signalements' },
  { id: 'avis', label: 'Avis' },
]

const REVIEW_TYPE_LABELS: Record<ReviewTargetType, string> = {
  prestataire: 'Prestataire',
  produit: 'Produit',
  agence: 'Agence',
}

type ReportTypeFilter = ReportTargetType | 'tous'
type ReportStatusFilter = ReportStatus | 'tous'
type ReviewTypeFilter = ReviewTargetType | 'tous'
type ReviewStatusFilter = ReviewStatus | 'tous'

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

function SignalementsTab() {
  const [reports, setReports] = useState<AdminReport[]>(ADMIN_REPORTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ReportTypeFilter>('tous')
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>('tous')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return reports.filter((r) => {
      if (typeFilter !== 'tous' && r.targetType !== typeFilter) return false
      if (statusFilter !== 'tous' && r.status !== statusFilter) return false
      if (query && !r.targetLabel.toLowerCase().includes(query) && !r.reporterName.toLowerCase().includes(query)) return false
      return true
    })
  }, [reports, search, typeFilter, statusFilter])

  function setStatus(id: string, status: ReportStatus) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const columns: DataTableColumn<AdminReport>[] = [
    {
      key: 'type',
      header: 'Type',
      sortValue: (r) => r.targetType,
      render: (r) => (
        <span className="inline-flex items-center rounded-[4px] bg-[#f7f7f7] px-2 py-0.5 text-[11px] font-semibold text-[#6a6a6a]">
          {REPORT_TYPE_LABELS[r.targetType]}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Élément signalé',
      sortValue: (r) => r.targetLabel,
      render: (r) =>
        r.targetHref ? (
          <Link href={r.targetHref} className="text-[13px] font-semibold text-[#222222] hover:underline">
            {r.targetLabel}
          </Link>
        ) : (
          <span className="text-[13px] font-semibold text-[#222222]">{r.targetLabel}</span>
        ),
    },
    {
      key: 'reason',
      header: 'Motif',
      render: (r) => (
        <div className="text-[13px]">
          <p className="font-medium text-[#222222]">{r.reason}</p>
          <p className="mt-0.5 max-w-[280px] text-[12px] text-[#888888]">{r.details}</p>
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
            className="inline-flex items-center gap-1 rounded-[8px] bg-[#16A34A] px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Traiter
          </button>
          <button
            type="button"
            disabled={r.status === 'rejete'}
            onClick={() => setStatus(r.id, 'rejete')}
            className="inline-flex items-center gap-1 rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle className="h-3.5 w-3.5" /> Rejeter
          </button>
        </div>
      ),
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
            placeholder="Rechercher par élément ou signaleur..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ReportTypeFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les types</option>
          {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReportStatusFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les statuts</option>
          {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} rowKey={(r) => r.id} pageSize={10} />
    </div>
  )
}

function AvisTab() {
  const [reviews, setReviews] = useState<AdminReview[]>(ADMIN_REVIEWS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ReviewTypeFilter>('tous')
  const [statusFilter, setStatusFilter] = useState<ReviewStatusFilter>('tous')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return reviews.filter((r) => {
      if (typeFilter !== 'tous' && r.targetType !== typeFilter) return false
      if (statusFilter !== 'tous' && r.status !== statusFilter) return false
      if (query && !r.targetName.toLowerCase().includes(query) && !r.author.toLowerCase().includes(query)) return false
      return true
    })
  }, [reviews, search, typeFilter, statusFilter])

  function setStatus(id: string, status: ReviewStatus) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const columns: DataTableColumn<AdminReview>[] = [
    {
      key: 'type',
      header: 'Type',
      sortValue: (r) => r.targetType,
      render: (r) => (
        <span className="inline-flex items-center rounded-[4px] bg-[#f7f7f7] px-2 py-0.5 text-[11px] font-semibold text-[#6a6a6a]">
          {REVIEW_TYPE_LABELS[r.targetType]}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Élément',
      sortValue: (r) => r.targetName,
      render: (r) =>
        r.targetHref ? (
          <Link href={r.targetHref} className="text-[13px] font-semibold text-[#222222] hover:underline">
            {r.targetName}
          </Link>
        ) : (
          <span className="text-[13px] font-semibold text-[#222222]">{r.targetName}</span>
        ),
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#ebebeb] bg-white p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-2">
          <Search className="h-4 w-4 text-[#b0b0b0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par élément ou auteur..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ReviewTypeFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les types</option>
          {Object.entries(REVIEW_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReviewStatusFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les statuts</option>
          {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} rowKey={(r) => r.id} pageSize={10} />
    </div>
  )
}

export default function AdminModerationPage() {
  const [tab, setTab] = useState<Tab>('signalements')

  const pendingReports = ADMIN_REPORTS.filter((r) => r.status === 'en_attente').length
  const treatedReports = ADMIN_REPORTS.filter((r) => r.status === 'traite').length
  const flaggedReviews = ADMIN_REVIEWS.filter((r) => r.status === 'signale').length
  const hiddenReviews = ADMIN_REVIEWS.filter((r) => r.status === 'masque').length

  return (
    <div className="space-y-5">
      <SectionHeader title="Modération" description="Gérez les signalements et les avis sur l'ensemble de la plateforme" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Signalements en attente" value={pendingReports.toString()} icon={ShieldAlert} accent="#DC2626" />
        <StatCard label="Signalements traités" value={treatedReports.toString()} icon={CheckCircle2} accent="#16A34A" />
        <StatCard label="Avis signalés" value={flaggedReviews.toString()} icon={MessageSquare} accent="#B45309" />
        <StatCard label="Avis masqués" value={hiddenReviews.toString()} icon={EyeOff} accent="#888888" />
      </div>

      <TabNav tab={tab} setTab={setTab} />

      {tab === 'signalements' && <SignalementsTab />}
      {tab === 'avis' && <AvisTab />}
    </div>
  )
}
