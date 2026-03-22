import { API_URL } from '#/lib/env'
import { auditColumns } from '#/lib/audit-table-columns'
import { authClient } from '#/lib/auth-client'
import { ChevronLeft, ChevronRight, ScrollText, Search } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { getAuditLog } from '@repo/shared/api/moderation'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/audit-log')({
  component: AuditLogPage,
})

function AuditLogPage() {
  const [globalFilter, setGlobalFilter] = useState('')

  const { data } = useQuery({
    queryKey: ['audit-log', { limit: 100 }],
    queryFn: () => getAuditLog(authClient as never, API_URL, { limit: 100 }),
  })

  const entries = data?.data ?? []

  const table = useReactTable({
    data: entries,
    columns: auditColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const entry = row.original
      return (
        entry.id.toLowerCase().includes(search) ||
        entry.reportId.toLowerCase().includes(search) ||
        entry.action.toLowerCase().includes(search) ||
        (entry.details ?? '').toLowerCase().includes(search)
      )
    },
  })

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <ScrollText size={22} className="text-accent" />
        <div>
          <h1 className="text-primary text-2xl font-bold">Audit Log</h1>
          <p className="text-muted mt-0.5 text-sm">All moderation activity across reports</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-80">
          <Search size={16} className="text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit log..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="border-border bg-surface-raised text-primary w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-colors"
          />
        </div>
        <span className="text-muted text-xs">{table.getFilteredRowModel().rows.length} entries</span>
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
                  <td colSpan={auditColumns.length} className="text-muted px-4 py-8 text-center text-sm">
                    No audit entries found.
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
