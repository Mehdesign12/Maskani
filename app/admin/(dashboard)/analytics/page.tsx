'use client'

import { useMemo } from 'react'
import { Building2, Eye, Handshake, MapPin, Percent, Sofa, TrendingUp, Users, Wallet } from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatCard } from '@/components/admin/StatCard'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { TrendAreaChart } from '@/components/admin/charts/TrendAreaChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { SimpleBarChart } from '@/components/admin/charts/SimpleBarChart'
import { CITY_STATS, MONTHLY_METRICS } from '@/lib/admin/mock-analytics'
import { formatCompactMAD, formatCompactNumber, formatNumber, formatPercent } from '@/lib/admin/format'
import type { CityStat } from '@/lib/admin/types'

function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
      <h3 className="text-[15px] font-bold leading-[1.25] text-[#222222]">{title}</h3>
      {description && <p className="mt-0.5 text-[12px] text-[#888888]">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const totals = useMemo(() => {
    return MONTHLY_METRICS.reduce(
      (acc, m) => ({
        visites: acc.visites + m.visites,
        revenu: acc.revenu + m.revenuImmobilier + m.revenuAmeublement + m.revenuPrestataires,
        nouveauxUtilisateurs: acc.nouveauxUtilisateurs + m.nouveauxUtilisateurs,
        conversions: acc.conversions + m.conversions,
        revenuImmobilier: acc.revenuImmobilier + m.revenuImmobilier,
        revenuAmeublement: acc.revenuAmeublement + m.revenuAmeublement,
        revenuPrestataires: acc.revenuPrestataires + m.revenuPrestataires,
      }),
      {
        visites: 0,
        revenu: 0,
        nouveauxUtilisateurs: 0,
        conversions: 0,
        revenuImmobilier: 0,
        revenuAmeublement: 0,
        revenuPrestataires: 0,
      }
    )
  }, [])

  const conversionRate = (totals.conversions / totals.visites) * 100

  const revenueSeries = [
    { key: 'revenuImmobilier', label: 'Immobilier', color: '#B19272' },
    { key: 'revenuAmeublement', label: 'Ameublement', color: '#16A34A' },
    { key: 'revenuPrestataires', label: 'Prestataires', color: '#4F6AE8' },
  ]

  const revenueBreakdown = [
    { name: 'Immobilier', value: totals.revenuImmobilier, color: '#B19272' },
    { name: 'Ameublement', value: totals.revenuAmeublement, color: '#16A34A' },
    { name: 'Prestataires', value: totals.revenuPrestataires, color: '#4F6AE8' },
  ]

  const topCitiesByVisites = CITY_STATS.slice(0, 8).map((c) => ({ city: c.city, visites: c.visites }))

  const cityColumns: DataTableColumn<CityStat>[] = [
    {
      key: 'city',
      header: 'Ville',
      sortValue: (c) => c.city,
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
          <MapPin className="h-3.5 w-3.5 text-[#b0b0b0]" /> {c.city}
        </span>
      ),
    },
    {
      key: 'listings',
      header: 'Annonces',
      align: 'right',
      sortValue: (c) => c.listings,
      render: (c) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(c.listings)}</span>,
    },
    {
      key: 'produits',
      header: 'Produits',
      align: 'right',
      sortValue: (c) => c.produits,
      render: (c) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(c.produits)}</span>,
    },
    {
      key: 'prestataires',
      header: 'Prestataires',
      align: 'right',
      sortValue: (c) => c.prestataires,
      render: (c) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(c.prestataires)}</span>,
    },
    {
      key: 'visites',
      header: 'Visites',
      align: 'right',
      sortValue: (c) => c.visites,
      render: (c) => <span className="text-[13px] font-semibold text-[#222222]">{formatCompactNumber(c.visites)}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader title="Analytics" description="Vue globale des performances de la plateforme sur les 12 derniers mois" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Visites cumulées" value={formatCompactNumber(totals.visites)} icon={Eye} accent="#7C3AED" />
        <StatCard label="Revenu cumulé" value={formatCompactMAD(totals.revenu)} icon={Wallet} accent="#D9BB9C" />
        <StatCard label="Nouveaux utilisateurs" value={formatCompactNumber(totals.nouveauxUtilisateurs)} icon={Users} accent="#4F6AE8" />
        <StatCard label="Taux de conversion moyen" value={formatPercent(conversionRate)} icon={Percent} accent="#16A34A" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Revenus par activité" description="Évolution sur les 12 derniers mois">
            <TrendAreaChart data={MONTHLY_METRICS} xKey="month" series={revenueSeries} valueFormatter={formatCompactMAD} />
          </Card>
        </div>
        <Card title="Répartition des revenus" description="Cumul sur 12 mois">
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Visites" description="Trafic global sur la plateforme">
          <TrendAreaChart
            data={MONTHLY_METRICS}
            xKey="month"
            series={[{ key: 'visites', label: 'Visites', color: '#7C3AED' }]}
            valueFormatter={formatCompactNumber}
          />
        </Card>
        <Card title="Acquisition" description="Nouveaux utilisateurs & conversions">
          <TrendAreaChart
            data={MONTHLY_METRICS}
            xKey="month"
            series={[
              { key: 'nouveauxUtilisateurs', label: 'Nouveaux utilisateurs', color: '#4F6AE8' },
              { key: 'conversions', label: 'Conversions', color: '#16A34A' },
            ]}
            valueFormatter={formatCompactNumber}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Top villes par visites" description="Activité cumulée sur la plateforme">
          <SimpleBarChart
            data={topCitiesByVisites}
            xKey="city"
            series={[{ key: 'visites', label: 'Visites', color: '#D9BB9C' }]}
            valueFormatter={formatCompactNumber}
            horizontal
            height={300}
          />
        </Card>
        <Card title="Répartition par ville" description="Annonces, produits et prestataires par ville">
          <DataTable columns={cityColumns} data={CITY_STATS} rowKey={(c) => c.city} pageSize={8} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#B19272]">
            <Building2 className="h-4 w-4" />
            <span className="text-[12px] font-bold uppercase tracking-[0.04em]">Immobilier</span>
          </div>
          <p className="mt-2 text-[20px] font-bold text-[#222222]">{formatCompactMAD(totals.revenuImmobilier)}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#888888]">
            <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" /> revenu cumulé sur 12 mois
          </p>
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#16A34A]">
            <Sofa className="h-4 w-4" />
            <span className="text-[12px] font-bold uppercase tracking-[0.04em]">Ameublement</span>
          </div>
          <p className="mt-2 text-[20px] font-bold text-[#222222]">{formatCompactMAD(totals.revenuAmeublement)}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#888888]">
            <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" /> revenu cumulé sur 12 mois
          </p>
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 text-[#4F6AE8]">
            <Handshake className="h-4 w-4" />
            <span className="text-[12px] font-bold uppercase tracking-[0.04em]">Prestataires</span>
          </div>
          <p className="mt-2 text-[20px] font-bold text-[#222222]">{formatCompactMAD(totals.revenuPrestataires)}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#888888]">
            <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" /> revenu cumulé sur 12 mois
          </p>
        </div>
      </div>
    </div>
  )
}
