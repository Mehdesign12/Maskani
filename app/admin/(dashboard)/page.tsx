'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Eye,
  Handshake,
  ShieldAlert,
  Sofa,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatusPill } from '@/components/admin/StatusPill'
import { TrendAreaChart } from '@/components/admin/charts/TrendAreaChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { SimpleBarChart } from '@/components/admin/charts/SimpleBarChart'
import { ADMIN_USERS, ROLE_LABELS, STATUS_LABELS } from '@/lib/admin/mock-users'
import { ADMIN_AGENCIES, ADMIN_LISTINGS, LISTING_STATUS_LABELS } from '@/lib/admin/mock-immobilier'
import { ADMIN_PRODUITS, ADMIN_VENDORS, PRODUIT_STATUS_LABELS } from '@/lib/admin/mock-ameublement'
import { ADMIN_PRESTATAIRES, PRESTATAIRE_CATEGORY_LABELS, PRESTATAIRE_STATUS_LABELS } from '@/lib/admin/mock-prestataires'
import { ADMIN_REPORTS, REPORT_TYPE_LABELS } from '@/lib/admin/mock-moderation'
import { CITY_STATS, MONTHLY_METRICS } from '@/lib/admin/mock-analytics'
import {
  LISTING_STATUS_TONES,
  PRESTATAIRE_STATUS_TONES,
  PRODUIT_STATUS_TONES,
  REPORT_STATUS_TONES,
  USER_STATUS_TONES,
  type StatusTone,
} from '@/lib/admin/status-colors'
import { formatCompactMAD, formatCompactNumber, formatNumber, formatPercent, formatRelativeTime } from '@/lib/admin/format'
import type { LucideIcon } from 'lucide-react'

function Card({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold leading-[1.25] text-[#222222]">{title}</h3>
          {description && <p className="mt-0.5 text-[12px] text-[#888888]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const activeUsers = ADMIN_USERS.filter((u) => u.status === 'actif').length
  const publishedListings = ADMIN_LISTINGS.filter((l) => l.status === 'publiee').length
  const onlineProducts = ADMIN_PRODUITS.filter((p) => p.status === 'en_ligne').length
  const verifiedPrestataires = ADMIN_PRESTATAIRES.filter((p) => p.status === 'verifie').length

  const lastMonth = MONTHLY_METRICS[MONTHLY_METRICS.length - 1]
  const prevMonth = MONTHLY_METRICS[MONTHLY_METRICS.length - 2]

  const totalRevenue = lastMonth.revenuImmobilier + lastMonth.revenuAmeublement + lastMonth.revenuPrestataires
  const prevTotalRevenue = prevMonth.revenuImmobilier + prevMonth.revenuAmeublement + prevMonth.revenuPrestataires
  const revenueTrend = ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100
  const visitsTrend = ((lastMonth.visites - prevMonth.visites) / prevMonth.visites) * 100

  const revenueBreakdown = [
    { name: 'Immobilier', value: lastMonth.revenuImmobilier, color: '#B19272' },
    { name: 'Ameublement', value: lastMonth.revenuAmeublement, color: '#16A34A' },
    { name: 'Prestataires', value: lastMonth.revenuPrestataires, color: '#4F6AE8' },
  ]

  const revenueSeries = [
    { key: 'revenuImmobilier', label: 'Immobilier', color: '#B19272' },
    { key: 'revenuAmeublement', label: 'Ameublement', color: '#16A34A' },
    { key: 'revenuPrestataires', label: 'Prestataires', color: '#4F6AE8' },
  ]

  const topCities = CITY_STATS.slice(0, 6).map((c) => ({ city: c.city, visites: c.visites }))

  const pendingReports = ADMIN_REPORTS.filter((r) => r.status === 'en_attente').slice(0, 5)

  type ActivityItem = {
    id: string
    icon: LucideIcon
    color: string
    label: string
    meta: string
    statusLabel: string
    tone: StatusTone
    href: string
    createdAt: string
  }

  const activity: ActivityItem[] = [
    ...ADMIN_LISTINGS.map((l) => ({
      id: l.id,
      icon: Building2,
      color: '#B19272',
      label: l.title,
      meta: l.city,
      statusLabel: LISTING_STATUS_LABELS[l.status],
      tone: LISTING_STATUS_TONES[l.status],
      href: '/admin/immobilier',
      createdAt: l.createdAt,
    })),
    ...ADMIN_PRODUITS.map((p) => ({
      id: p.id,
      icon: Sofa,
      color: '#16A34A',
      label: p.name,
      meta: p.vendorName,
      statusLabel: PRODUIT_STATUS_LABELS[p.status],
      tone: PRODUIT_STATUS_TONES[p.status],
      href: '/admin/ameublement',
      createdAt: p.createdAt,
    })),
    ...ADMIN_PRESTATAIRES.map((p) => ({
      id: p.id,
      icon: Handshake,
      color: '#4F6AE8',
      label: p.name,
      meta: PRESTATAIRE_CATEGORY_LABELS[p.category as keyof typeof PRESTATAIRE_CATEGORY_LABELS],
      statusLabel: PRESTATAIRE_STATUS_LABELS[p.status],
      tone: PRESTATAIRE_STATUS_TONES[p.status],
      href: '/admin/prestataires',
      createdAt: p.createdAt,
    })),
    ...ADMIN_USERS.map((u) => ({
      id: u.id,
      icon: Users,
      color: '#888888',
      label: u.name,
      meta: ROLE_LABELS[u.role],
      statusLabel: STATUS_LABELS[u.status],
      tone: USER_STATUS_TONES[u.status],
      href: '/admin/utilisateurs',
      createdAt: u.joinedAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const topAgencies = [...ADMIN_AGENCIES].sort((a, b) => b.leadsCount - a.leadsCount).slice(0, 4)
  const topVendors = [...ADMIN_VENDORS].sort((a, b) => b.salesTotal - a.salesTotal).slice(0, 4)
  const topPrestataires = [...ADMIN_PRESTATAIRES].sort((a, b) => b.leadsCount - a.leadsCount).slice(0, 4)

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité sur Immobilier, Ameublement et Prestataires"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-[32px] border border-[#ebebeb] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#6a6a6a]">
            <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
            Données simulées · {lastMonth.month}
          </span>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Utilisateurs actifs"
          value={formatNumber(activeUsers)}
          icon={Users}
          accent="#888888"
          helper={`sur ${formatNumber(ADMIN_USERS.length)} inscrits`}
        />
        <StatCard
          label="Annonces publiées"
          value={formatNumber(publishedListings)}
          icon={Building2}
          accent="#B19272"
          helper={`sur ${formatNumber(ADMIN_LISTINGS.length)} annonces`}
        />
        <StatCard
          label="Produits en ligne"
          value={formatNumber(onlineProducts)}
          icon={Sofa}
          accent="#16A34A"
          helper={`sur ${formatNumber(ADMIN_PRODUITS.length)} produits`}
        />
        <StatCard
          label="Prestataires vérifiés"
          value={formatNumber(verifiedPrestataires)}
          icon={Handshake}
          accent="#4F6AE8"
          helper={`sur ${formatNumber(ADMIN_PRESTATAIRES.length)} profils`}
        />
        <StatCard
          label="Revenu du mois"
          value={formatCompactMAD(totalRevenue)}
          icon={Wallet}
          accent="#D9BB9C"
          trend={{ value: formatPercent(revenueTrend), direction: revenueTrend >= 0 ? 'up' : 'down' }}
        />
        <StatCard
          label="Visites du mois"
          value={formatCompactNumber(lastMonth.visites)}
          icon={Eye}
          accent="#7C3AED"
          trend={{ value: formatPercent(visitsTrend), direction: visitsTrend >= 0 ? 'up' : 'down' }}
        />
      </div>

      {/* Revenue trend + breakdown */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Revenus par activité" description="Évolution sur les 12 derniers mois">
            <TrendAreaChart data={MONTHLY_METRICS} xKey="month" series={revenueSeries} valueFormatter={formatCompactMAD} />
          </Card>
        </div>
        <Card title="Répartition des revenus" description={lastMonth.month}>
          <DonutChart data={revenueBreakdown} height={180} />
          <div className="mt-4 space-y-2">
            {revenueBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#6a6a6a]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#222222]">{formatCompactMAD(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top cities + moderation queue */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Top villes par visites" description="Activité cumulée sur la plateforme">
          <SimpleBarChart
            data={topCities}
            xKey="city"
            series={[{ key: 'visites', label: 'Visites', color: '#D9BB9C' }]}
            valueFormatter={formatCompactNumber}
            horizontal
            height={260}
          />
        </Card>

        <Card
          title="File de modération"
          description={`${pendingReports.length} signalement(s) en attente`}
          action={
            <Link
              href="/admin/moderation"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#B19272] hover:underline"
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-2">
            {pendingReports.map((report) => (
              <Link
                key={report.id}
                href={report.targetHref ?? '/admin/moderation'}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3f3f3] px-3.5 py-2.5 transition-colors hover:bg-[#fafafa]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#222222]">{report.targetLabel}</p>
                  <p className="mt-0.5 truncate text-[12px] text-[#888888]">
                    {REPORT_TYPE_LABELS[report.targetType]} · {report.reason}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#DC2626]" />
                  <StatusPill label="En attente" tone={REPORT_STATUS_TONES[report.status]} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity feed + top performers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Activité récente" description="Derniers éléments ajoutés à la plateforme">
          <div className="space-y-2">
            {activity.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={`${item.href}-${item.id}`}
                  href={item.href}
                  className="flex items-center gap-3 rounded-[14px] border border-[#f3f3f3] px-3.5 py-2.5 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${item.color}1A` }}>
                    <Icon className="h-4 w-4" style={{ color: item.color }} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#222222]">{item.label}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#888888]">
                      {item.meta} · {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                  <StatusPill label={item.statusLabel} tone={item.tone} />
                </Link>
              )
            })}
          </div>
        </Card>

        <Card title="Top performeurs" description="Meilleurs acteurs par activité">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#B19272]">Agences immobilières</p>
              <div className="space-y-1.5">
                {topAgencies.map((agency, index) => (
                  <div key={agency.id} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fdf4e7] text-[11px] font-bold text-[#B19272]">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#222222]">{agency.name}</span>
                    </div>
                    <span className="text-[#888888]">{formatNumber(agency.leadsCount)} leads</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#16A34A]">Vendeurs ameublement</p>
              <div className="space-y-1.5">
                {topVendors.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F0FDF4] text-[11px] font-bold text-[#16A34A]">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#222222]">{vendor.name}</span>
                    </div>
                    <span className="text-[#888888]">{formatCompactMAD(vendor.salesTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#4F6AE8]">Prestataires</p>
              <div className="space-y-1.5">
                {topPrestataires.map((prestataire, index) => (
                  <div key={prestataire.id} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF2FF] text-[11px] font-bold text-[#4F6AE8]">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#222222]">{prestataire.name}</span>
                    </div>
                    <span className="text-[#888888]">{formatNumber(prestataire.leadsCount)} leads</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
