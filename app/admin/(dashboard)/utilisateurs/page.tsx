'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Ban,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Search,
  Sofa,
  Star,
  Users,
  X,
} from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatCard } from '@/components/admin/StatCard'
import { StatusPill } from '@/components/admin/StatusPill'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { Drawer } from '@/components/admin/Drawer'
import { ADMIN_USERS, ROLE_LABELS, STATUS_LABELS } from '@/lib/admin/mock-users'
import { SUBSCRIPTION_LABELS, SUBSCRIPTION_TONES, USER_STATUS_TONES } from '@/lib/admin/status-colors'
import { formatDate, formatNumber, formatRelativeTime } from '@/lib/admin/format'
import type { AdminUser, AdminUserRole, AdminUserStatus } from '@/lib/admin/types'

const ROLE_FILTERS: { value: AdminUserRole | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Tous les rôles' },
  { value: 'particulier', label: 'Particuliers' },
  { value: 'agence', label: 'Agences' },
  { value: 'promoteur', label: 'Promoteurs' },
  { value: 'prestataire', label: 'Prestataires' },
  { value: 'vendeur', label: 'Vendeurs' },
  { value: 'admin', label: 'Admins' },
]

const STATUS_FILTERS: { value: AdminUserStatus | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actifs' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'suspendu', label: 'Suspendus' },
]

function activityLabel(user: AdminUser): string {
  if (user.role === 'agence' || user.role === 'promoteur' || user.role === 'particulier') {
    return `${formatNumber(user.listingsCount)} annonce${user.listingsCount === 1 ? '' : 's'}`
  }
  if (user.role === 'vendeur') {
    return `${formatNumber(user.produitsCount)} produit${user.produitsCount === 1 ? '' : 's'}`
  }
  if (user.role === 'prestataire') {
    return `${formatNumber(user.servicesCount)} service${user.servicesCount === 1 ? '' : 's'}`
  }
  return '—'
}

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | 'tous'>('tous')
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'tous'>('tous')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null)

  const totals = useMemo(() => {
    const actif = users.filter((u) => u.status === 'actif').length
    const enAttente = users.filter((u) => u.status === 'en_attente').length
    const suspendu = users.filter((u) => u.status === 'suspendu').length
    const abonnes = users.filter((u) => u.subscription !== 'free').length
    return { total: users.length, actif, enAttente, suspendu, abonnes }
  }, [users])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'tous' && u.role !== roleFilter) return false
      if (statusFilter !== 'tous' && u.status !== statusFilter) return false
      if (query && !u.name.toLowerCase().includes(query) && !u.email.toLowerCase().includes(query)) return false
      return true
    })
  }, [users, search, roleFilter, statusFilter])

  function updateStatus(ids: Set<string>, status: AdminUserStatus) {
    setUsers((prev) => prev.map((u) => (ids.has(u.id) ? { ...u, status } : u)))
  }

  function handleBulkActivate() {
    updateStatus(selected, 'actif')
    setSelected(new Set())
  }

  function handleBulkSuspend() {
    updateStatus(selected, 'suspendu')
    setSelected(new Set())
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: 'user',
      header: 'Utilisateur',
      sortValue: (u) => u.name,
      render: (u) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{u.name}</p>
            <p className="truncate text-[12px] text-[#888888]">{u.email}</p>
          </div>
          {u.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#4F6AE8]" />}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      sortValue: (u) => u.role,
      render: (u) => <span className="text-[13px] font-medium text-[#222222]">{ROLE_LABELS[u.role]}</span>,
    },
    {
      key: 'city',
      header: 'Ville',
      sortValue: (u) => u.city,
      render: (u) => <span className="text-[13px] text-[#6a6a6a]">{u.city}</span>,
    },
    {
      key: 'subscription',
      header: 'Abonnement',
      sortValue: (u) => u.subscription,
      render: (u) => <StatusPill label={SUBSCRIPTION_LABELS[u.subscription]} tone={SUBSCRIPTION_TONES[u.subscription]} />,
    },
    {
      key: 'activity',
      header: 'Activité',
      render: (u) => <span className="text-[13px] text-[#6a6a6a]">{activityLabel(u)}</span>,
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (u) => u.status,
      render: (u) => <StatusPill label={STATUS_LABELS[u.status]} tone={USER_STATUS_TONES[u.status]} />,
    },
    {
      key: 'joinedAt',
      header: 'Inscrit le',
      sortValue: (u) => u.joinedAt,
      render: (u) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(u.joinedAt)}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Utilisateurs"
        description="Gérez les comptes particuliers, agences, vendeurs et prestataires de la plateforme"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total" value={formatNumber(totals.total)} icon={Users} accent="#888888" />
        <StatCard label="Actifs" value={formatNumber(totals.actif)} icon={CheckCircle2} accent="#16A34A" />
        <StatCard label="En attente" value={formatNumber(totals.enAttente)} icon={Clock} accent="#B45309" />
        <StatCard label="Suspendus" value={formatNumber(totals.suspendu)} icon={Ban} accent="#DC2626" />
        <StatCard label="Abonnés payants" value={formatNumber(totals.abonnes)} icon={Star} accent="#7C3AED" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#ebebeb] bg-white p-4">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[32px] border border-[#ebebeb] bg-[#f7f7f7] px-4 py-2">
          <Search className="h-4 w-4 text-[#b0b0b0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou e-mail..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as AdminUserRole | 'tous')}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          {ROLE_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AdminUserStatus | 'tous')}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-[14px] border border-[#B19272]/30 bg-[#fdf4e7] px-4 py-2.5">
          <p className="text-[13px] font-semibold text-[#222222]">{selected.size} utilisateur(s) sélectionné(s)</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkActivate}
              className="rounded-[8px] bg-[#16A34A] px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Activer
            </button>
            <button
              type="button"
              onClick={handleBulkSuspend}
              className="rounded-[8px] bg-[#DC2626] px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Suspendre
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#dddddd] text-[#6a6a6a] hover:bg-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(u) => u.id}
        onRowClick={(u) => setActiveUser(u)}
        selectable
        selected={selected}
        onSelectChange={setSelected}
        pageSize={10}
      />

      <Drawer
        open={!!activeUser}
        onClose={() => setActiveUser(null)}
        title={activeUser?.name ?? ''}
        subtitle={activeUser ? ROLE_LABELS[activeUser.role] : undefined}
      >
        {activeUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeUser.avatar} alt={activeUser.name} className="h-16 w-16 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-[#222222]">{activeUser.name}</p>
                  {activeUser.isVerified && <BadgeCheck className="h-4 w-4 text-[#4F6AE8]" />}
                </div>
                <p className="mt-1 text-[12px] text-[#888888]">{activeUser.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatusPill label={STATUS_LABELS[activeUser.status]} tone={USER_STATUS_TONES[activeUser.status]} />
              <StatusPill label={SUBSCRIPTION_LABELS[activeUser.subscription]} tone={SUBSCRIPTION_TONES[activeUser.subscription]} />
            </div>

            <div className="space-y-3 rounded-[14px] border border-[#f3f3f3] p-4">
              <div className="flex items-center gap-2.5 text-[13px] text-[#6a6a6a]">
                <Mail className="h-4 w-4 text-[#b0b0b0]" />
                {activeUser.email}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-[#6a6a6a]">
                <Phone className="h-4 w-4 text-[#b0b0b0]" />
                {activeUser.phone}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-[#6a6a6a]">
                <MapPin className="h-4 w-4 text-[#b0b0b0]" />
                {activeUser.city}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-[#6a6a6a]">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" />
                Inscrit le {formatDate(activeUser.joinedAt)} · actif {formatRelativeTime(activeUser.lastActiveAt)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3 text-center">
                <Building2 className="mx-auto h-4 w-4 text-[#B19272]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(activeUser.listingsCount)}</p>
                <p className="text-[11px] text-[#888888]">Annonces</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3 text-center">
                <Sofa className="mx-auto h-4 w-4 text-[#16A34A]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(activeUser.produitsCount)}</p>
                <p className="text-[11px] text-[#888888]">Produits</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3 text-center">
                <Handshake className="mx-auto h-4 w-4 text-[#4F6AE8]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(activeUser.servicesCount)}</p>
                <p className="text-[11px] text-[#888888]">Services</p>
              </div>
            </div>

            {activeUser.rating !== undefined && (
              <div className="flex items-center gap-2 rounded-[14px] border border-[#f3f3f3] p-4">
                <Star className="h-4 w-4 fill-[#D9BB9C] text-[#D9BB9C]" />
                <span className="text-[13px] font-semibold text-[#222222]">{activeUser.rating.toFixed(1)} / 5</span>
                <span className="text-[12px] text-[#888888]">de satisfaction moyenne</span>
              </div>
            )}

            <div className="flex gap-2">
              {activeUser.status !== 'actif' && (
                <button
                  type="button"
                  onClick={() => {
                    updateStatus(new Set([activeUser.id]), 'actif')
                    setActiveUser({ ...activeUser, status: 'actif' })
                  }}
                  className="flex-1 rounded-[8px] bg-[#16A34A] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Activer le compte
                </button>
              )}
              {activeUser.status !== 'suspendu' && (
                <button
                  type="button"
                  onClick={() => {
                    updateStatus(new Set([activeUser.id]), 'suspendu')
                    setActiveUser({ ...activeUser, status: 'suspendu' })
                  }}
                  className="flex-1 rounded-[8px] bg-[#DC2626] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Suspendre le compte
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
