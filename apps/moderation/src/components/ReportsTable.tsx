import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ModerationReport, ReportStatus } from '@repo/types'
import { useMemo, useState } from 'react'

const STATUS_OPTIONS: { value: ReportStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
]

interface ReportsTableProps {
  data: ModerationReport[]
  columns: Parameters<typeof useReactTable<ModerationReport>>[0]['columns']
}

export function ReportsTable({ data, columns }: ReportsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return data
    return data.filter(r => r.status === statusFilter)
  }, [data, statusFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const report = row.original
      return (
        report.id.toLowerCase().includes(search) ||
        report.reason.toLowerCase().includes(search) ||
        (report.description ?? '').toLowerCase().includes(search)
      )
    },
  })

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-80">
          <Search size={16} className="text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="border-border bg-surface-raised text-primary w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-colors"
          />
        </div>
        <div className="border-border bg-surface-raised flex gap-1 rounded-lg border p-0.5">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === opt.value ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-muted text-xs">{table.getFilteredRowModel().rows.length} results</span>
      </div>

      <div className="border-border bg-surface overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-border border-b">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-muted cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-border-subtle hover:bg-surface-hover border-b transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3" style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-muted px-4 py-8 text-center text-sm">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-border flex items-center justify-between border-t px-4 py-3">
          <span className="text-muted text-xs">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-border text-secondary rounded-md border p-1.5 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-border text-secondary rounded-md border p-1.5 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
