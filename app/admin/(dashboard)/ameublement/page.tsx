'use client'

import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  Boxes,
  Calendar,
  CheckCircle2,
  EyeOff,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Sofa,
  Star,
  TrendingUp,
} from 'lucide-react'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { StatCard } from '@/components/admin/StatCard'
import { StatusPill } from '@/components/admin/StatusPill'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { Drawer } from '@/components/admin/Drawer'
import { TrendAreaChart } from '@/components/admin/charts/TrendAreaChart'
import { DonutChart } from '@/components/admin/charts/DonutChart'
import { SimpleBarChart } from '@/components/admin/charts/SimpleBarChart'
import { ADMIN_PRODUITS, ADMIN_VENDORS, PRODUIT_STATUS_LABELS } from '@/lib/admin/mock-ameublement'
import { CATEGORY_META } from '@/lib/category-meta'
import { CITY_STATS, MONTHLY_METRICS } from '@/lib/admin/mock-analytics'
import { PRODUIT_STATUS_TONES } from '@/lib/admin/status-colors'
import { formatCompactMAD, formatDate, formatMAD, formatNumber } from '@/lib/admin/format'
import type { AdminProduit, AdminProduitStatus, AdminVendor } from '@/lib/admin/types'

type Tab = 'produits' | 'categories' | 'vendeurs' | 'analytics'

const TABS: { id: Tab; label: string }[] = [
  { id: 'produits', label: 'Produits' },
  { id: 'categories', label: 'Catégories' },
  { id: 'vendeurs', label: 'Vendeurs' },
  { id: 'analytics', label: 'Analytics' },
]

type StatusFilter = AdminProduitStatus | 'tous'

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

function ProduitsTab() {
  const [produits, setProduits] = useState<AdminProduit[]>(ADMIN_PRODUITS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous')
  const [categoryFilter, setCategoryFilter] = useState<string>('tous')
  const [active, setActive] = useState<AdminProduit | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return produits.filter((p) => {
      if (statusFilter !== 'tous' && p.status !== statusFilter) return false
      if (categoryFilter !== 'tous' && p.category !== categoryFilter) return false
      if (query && !p.name.toLowerCase().includes(query) && !p.brand.toLowerCase().includes(query)) return false
      return true
    })
  }, [produits, search, statusFilter, categoryFilter])

  function setStatus(id: string, status: AdminProduitStatus) {
    setProduits((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
  }

  const columns: DataTableColumn<AdminProduit>[] = [
    {
      key: 'name',
      header: 'Produit',
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.name} className="h-10 w-10 shrink-0 rounded-[8px] object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#222222]">{p.name}</p>
            <p className="truncate text-[12px] text-[#888888]">{p.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      sortValue: (p) => p.category,
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-[13px] text-[#222222]">
          <span>{CATEGORY_META[p.category]?.emoji}</span>
          {CATEGORY_META[p.category]?.label ?? p.category}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Prix',
      align: 'right',
      sortValue: (p) => p.price,
      render: (p) => (
        <div className="text-right">
          <p className="text-[13px] font-semibold text-[#222222]">{formatMAD(p.price)}</p>
          {p.oldPrice && <p className="text-[12px] text-[#b0b0b0] line-through">{formatMAD(p.oldPrice)}</p>}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      sortValue: (p) => p.stockQty,
      render: (p) =>
        p.inStock && p.stockQty > 0 ? (
          <span className="text-[13px] text-[#6a6a6a]">{formatNumber(p.stockQty)}</span>
        ) : (
          <span className="text-[13px] font-semibold text-[#DC2626]">Rupture</span>
        ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortValue: (p) => p.status,
      render: (p) => <StatusPill label={PRODUIT_STATUS_LABELS[p.status]} tone={PRODUIT_STATUS_TONES[p.status]} />,
    },
    {
      key: 'sales',
      header: 'Ventes',
      align: 'right',
      sortValue: (p) => p.salesCount,
      render: (p) => <span className="text-[13px] text-[#6a6a6a]">{formatNumber(p.salesCount)}</span>,
    },
    {
      key: 'rating',
      header: 'Note',
      align: 'right',
      sortValue: (p) => p.rating,
      render: (p) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          <Star className="h-3.5 w-3.5 fill-[#D9BB9C] text-[#D9BB9C]" /> {p.rating.toFixed(1)}
          <span className="text-[12px] font-normal text-[#888888]">({p.reviewCount})</span>
        </span>
      ),
    },
    {
      key: 'vendor',
      header: 'Vendeur',
      sortValue: (p) => p.vendorName,
      render: (p) => <span className="text-[13px] text-[#6a6a6a]">{p.vendorName}</span>,
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
            placeholder="Rechercher par nom ou marque..."
            className="w-full bg-transparent text-[13px] text-[#222222] placeholder:text-[#b0b0b0] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Tous les statuts</option>
          {Object.entries(PRODUIT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-[32px] border border-[#ebebeb] bg-white px-4 py-2 text-[13px] font-medium text-[#222222] focus:outline-none"
        >
          <option value="tous">Toutes les catégories</option>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.emoji} {meta.label}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#888888]">{filtered.length} résultat(s)</span>
      </div>

      <DataTable columns={columns} data={filtered} rowKey={(p) => p.id} onRowClick={setActive} pageSize={10} />

      <Drawer open={!!active} onClose={() => setActive(null)} title={active?.name ?? ''} subtitle={active?.brand}>
        {active && (
          <div className="space-y-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.images[0]} alt={active.name} className="h-44 w-full rounded-[14px] object-cover" />

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label={PRODUIT_STATUS_LABELS[active.status]} tone={PRODUIT_STATUS_TONES[active.status]} />
              {active.isNew && (
                <span className="rounded-[4px] bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4F6AE8]">Nouveauté</span>
              )}
              {active.isBestSeller && (
                <span className="rounded-[4px] bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">Best-seller</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Catégorie</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">
                  {CATEGORY_META[active.category]?.emoji} {CATEGORY_META[active.category]?.label ?? active.category}
                </p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Style</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{active.style}</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Prix</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">{formatMAD(active.price)}</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Stock</p>
                <p className="mt-1 text-[14px] font-semibold text-[#222222]">
                  {active.inStock && active.stockQty > 0 ? `${formatNumber(active.stockQty)} unités` : 'Rupture de stock'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <ShoppingBag className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{formatNumber(active.salesCount)}</p>
                <p className="text-[11px] text-[#888888]">Ventes</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Star className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{active.rating.toFixed(1)}</p>
                <p className="text-[11px] text-[#888888]">{formatNumber(active.reviewCount)} avis</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <Boxes className="mx-auto h-4 w-4 text-[#888888]" />
                <p className="mt-1.5 text-[16px] font-bold text-[#222222]">{active.city}</p>
                <p className="text-[11px] text-[#888888]">Localisation</p>
              </div>
            </div>

            <div className="space-y-2 rounded-[14px] border border-[#f3f3f3] p-4 text-[13px] text-[#6a6a6a]">
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-[#b0b0b0]" /> Vendu par {active.vendorName}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" /> Ajouté le {formatDate(active.createdAt)}
              </div>
            </div>

            <div className="flex gap-2">
              {active.status !== 'en_ligne' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'en_ligne')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#16A34A] py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mettre en ligne
                </button>
              )}
              {active.status !== 'masque' && (
                <button
                  type="button"
                  onClick={() => setStatus(active.id, 'masque')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[#dddddd] py-2.5 text-[13px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa]"
                >
                  <EyeOff className="h-4 w-4" /> Masquer
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function CategoriesTab() {
  const stats = useMemo(() => {
    return Object.entries(CATEGORY_META).map(([key, meta]) => {
      const items = ADMIN_PRODUITS.filter((p) => p.category === key)
      const sales = items.reduce((sum, p) => sum + p.salesCount, 0)
      const avgPrice = items.length ? items.reduce((sum, p) => sum + p.price, 0) / items.length : 0
      return { key, meta, count: items.length, sales, avgPrice }
    })
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ key, meta, count, sales, avgPrice }) => (
        <div key={key} className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-[18px] ${meta.bg}`}>{meta.emoji}</div>
            <div>
              <p className="text-[14px] font-bold text-[#222222]">{meta.label}</p>
              <p className="text-[12px] text-[#888888]">{count} produit{count === 1 ? '' : 's'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Ventes cumulées</p>
              <p className="mt-1 font-semibold text-[#222222]">{formatNumber(sales)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Prix moyen</p>
              <p className="mt-1 font-semibold text-[#222222]">{count ? formatMAD(Math.round(avgPrice)) : '—'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function VendeursTab() {
  const [active, setActive] = useState<AdminVendor | null>(null)

  const columns: DataTableColumn<AdminVendor>[] = [
    {
      key: 'name',
      header: 'Vendeur',
      sortValue: (v) => v.name,
      render: (v) => (
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#222222]">{v.name}</span>
          {v.isVerified && <BadgeCheck className="h-4 w-4 text-[#4F6AE8]" />}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Ville',
      sortValue: (v) => v.city,
      render: (v) => <span className="text-[13px] text-[#6a6a6a]">{v.city}</span>,
    },
    {
      key: 'category',
      header: 'Catégorie principale',
      sortValue: (v) => v.mainCategory,
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-[13px] text-[#222222]">
          <span>{CATEGORY_META[v.mainCategory]?.emoji}</span>
          {CATEGORY_META[v.mainCategory]?.label ?? v.mainCategory}
        </span>
      ),
    },
    {
      key: 'products',
      header: 'Produits',
      align: 'right',
      sortValue: (v) => v.productsCount,
      render: (v) => <span className="text-[13px] font-semibold text-[#222222]">{formatNumber(v.productsCount)}</span>,
    },
    {
      key: 'rating',
      header: 'Note',
      align: 'right',
      sortValue: (v) => v.rating,
      render: (v) => (
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          <Star className="h-3.5 w-3.5 fill-[#D9BB9C] text-[#D9BB9C]" /> {v.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'sales',
      header: 'Ventes totales',
      align: 'right',
      sortValue: (v) => v.salesTotal,
      render: (v) => <span className="text-[13px] text-[#6a6a6a]">{formatCompactMAD(v.salesTotal)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Membre depuis',
      sortValue: (v) => v.createdAt,
      render: (v) => <span className="text-[13px] text-[#6a6a6a]">{formatDate(v.createdAt)}</span>,
    },
  ]

  const vendorProducts = active ? ADMIN_PRODUITS.filter((p) => p.vendorId === active.id).sort((a, b) => b.salesCount - a.salesCount).slice(0, 5) : []

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={ADMIN_VENDORS} rowKey={(v) => v.id} onRowClick={setActive} pageSize={10} />

      <Drawer open={!!active} onClose={() => setActive(null)} title={active?.name ?? ''} subtitle={active?.city}>
        {active && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {active.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#4F6AE8]">
                  <BadgeCheck className="h-3 w-3" /> Vérifié
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[13px] text-[#222222]">
                {CATEGORY_META[active.mainCategory]?.emoji} {CATEGORY_META[active.mainCategory]?.label ?? active.mainCategory}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{formatNumber(active.productsCount)}</p>
                <p className="text-[11px] text-[#888888]">Produits</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{active.rating.toFixed(1)}</p>
                <p className="text-[11px] text-[#888888]">Note moyenne</p>
              </div>
              <div className="rounded-[14px] border border-[#f3f3f3] p-3">
                <p className="text-[16px] font-bold text-[#222222]">{formatCompactMAD(active.salesTotal)}</p>
                <p className="text-[11px] text-[#888888]">Ventes totales</p>
              </div>
            </div>

            <div className="space-y-2 rounded-[14px] border border-[#f3f3f3] p-4 text-[13px] text-[#6a6a6a]">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#b0b0b0]" /> {active.city}
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#b0b0b0]" /> Membre depuis le {formatDate(active.createdAt)}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.04em] text-[#16A34A]">Meilleurs produits</p>
              <div className="space-y-1.5">
                {vendorProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-[13px]">
                    <span className="truncate font-medium text-[#222222]">{p.name}</span>
                    <span className="shrink-0 text-[#888888]">{formatNumber(p.salesCount)} ventes</span>
                  </div>
                ))}
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
    const counts = new Map<AdminProduitStatus, number>()
    for (const p of ADMIN_PRODUITS) counts.set(p.status, (counts.get(p.status) ?? 0) + 1)
    const colors: Record<AdminProduitStatus, string> = { en_ligne: '#16A34A', en_attente: '#B45309', masque: '#b0b0b0' }
    return Array.from(counts.entries()).map(([status, value]) => ({ name: PRODUIT_STATUS_LABELS[status], value, color: colors[status] }))
  }, [])

  const categorySales = useMemo(() => {
    return Object.entries(CATEGORY_META)
      .map(([key, meta]) => ({
        category: meta.label,
        ventes: ADMIN_PRODUITS.filter((p) => p.category === key).reduce((sum, p) => sum + p.salesCount, 0),
      }))
      .sort((a, b) => b.ventes - a.ventes)
      .slice(0, 8)
  }, [])

  const topCities = CITY_STATS.filter((c) => c.produits > 0).slice(0, 6).map((c) => ({ city: c.city, produits: c.produits }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Revenu Ameublement</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">Évolution sur les 12 derniers mois</p>
          <TrendAreaChart
            data={MONTHLY_METRICS}
            xKey="month"
            series={[{ key: 'revenuAmeublement', label: 'Revenu', color: '#16A34A' }]}
            valueFormatter={formatCompactMAD}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Répartition par statut</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">{ADMIN_PRODUITS.length} produits au total</p>
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
          <h3 className="text-[15px] font-bold text-[#222222]">Ventes par catégorie</h3>
          <SimpleBarChart
            data={categorySales}
            xKey="category"
            series={[{ key: 'ventes', label: 'Ventes', color: '#16A34A' }]}
            horizontal
            height={300}
          />
        </div>
        <div className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[var(--shadow-elevated)]">
          <h3 className="text-[15px] font-bold text-[#222222]">Top villes par produits</h3>
          <SimpleBarChart
            data={topCities}
            xKey="city"
            series={[{ key: 'produits', label: 'Produits', color: '#D9BB9C' }]}
            horizontal
            height={300}
          />
        </div>
      </div>
    </div>
  )
}

export default function AdminAmeublementPage() {
  const [tab, setTab] = useState<Tab>('produits')

  const total = ADMIN_PRODUITS.length
  const enLigne = ADMIN_PRODUITS.filter((p) => p.status === 'en_ligne').length
  const ruptureStock = ADMIN_PRODUITS.filter((p) => !p.inStock || p.stockQty === 0).length
  const totalSales = ADMIN_PRODUITS.reduce((sum, p) => sum + p.salesCount, 0)
  const avgRating = ADMIN_PRODUITS.reduce((sum, p) => sum + p.rating, 0) / total

  return (
    <div className="space-y-5">
      <SectionHeader title="Ameublement" description="Gérez le catalogue, les catégories et les vendeurs du marketplace ameublement" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total produits" value={formatNumber(total)} icon={Sofa} accent="#16A34A" />
        <StatCard label="En ligne" value={formatNumber(enLigne)} icon={CheckCircle2} accent="#16A34A" />
        <StatCard label="Rupture de stock" value={formatNumber(ruptureStock)} icon={Boxes} accent="#DC2626" />
        <StatCard label="Ventes cumulées" value={formatNumber(totalSales)} icon={TrendingUp} accent="#B19272" />
        <StatCard label="Note moyenne" value={avgRating.toFixed(1)} icon={Star} accent="#7C3AED" />
      </div>

      <TabNav tab={tab} setTab={setTab} />

      {tab === 'produits' && <ProduitsTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'vendeurs' && <VendeursTab />}
      {tab === 'analytics' && <AnalyticsTab />}
    </div>
  )
}
