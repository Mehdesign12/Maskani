'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  align?: 'left' | 'right' | 'center'
  width?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  selectable?: boolean
  selected?: Set<string>
  onSelectChange?: (selected: Set<string>) => void
  pageSize?: number
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectable,
  selected,
  onSelectChange,
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sortKey) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return data
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pageData = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize)

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleAll() {
    if (!onSelectChange) return
    if (selected && pageData.length > 0 && selected.size === pageData.length) {
      onSelectChange(new Set())
    } else {
      onSelectChange(new Set(pageData.map(rowKey)))
    }
  }

  function toggleRow(id: string) {
    if (!onSelectChange || !selected) return
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectChange(next)
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#ebebeb] bg-[#fafafa]">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={!!selected && pageData.length > 0 && selected.size === pageData.length}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-[#dddddd] accent-[#B19272]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#888888]',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                  style={{ width: col.width }}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-[#222222]"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => {
              const id = rowKey(row)
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-[#f3f3f3] last:border-0',
                    onRowClick && 'cursor-pointer hover:bg-[#fafafa]'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!selected?.has(id)}
                        onChange={() => toggleRow(id)}
                        className="h-4 w-4 rounded border-[#dddddd] accent-[#B19272]"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              )
            })}
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-10 text-center text-[13px] text-[#b0b0b0]"
                >
                  Aucun résultat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#ebebeb] px-4 py-3">
          <p className="text-[12px] text-[#888888]">
            Page {safePage + 1} sur {totalPages} · {sorted.length} résultats
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="rounded-[8px] border border-[#dddddd] px-3 py-1.5 text-[12px] font-semibold text-[#222222] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
