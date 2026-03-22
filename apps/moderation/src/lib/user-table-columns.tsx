import { createColumnHelper } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

import { formatDate, getUserFullName } from '#/lib/mock-data'
import type { AdminUser, BanStatus } from '#/lib/types'

const STATUS_CONFIG: Record<BanStatus, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-success-subtle text-success' },
  suspended: { label: 'Suspended', classes: 'bg-warning-subtle text-warning' },
  banned: { label: 'Banned', classes: 'bg-danger-subtle text-danger' },
}

const columnHelper = createColumnHelper<AdminUser>()

export const userColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-muted">
        {info.getValue().slice(0, 8)}
      </span>
    ),
    size: 80,
  }),
  columnHelper.display({
    id: 'name',
    header: 'Name',
    cell: (info) => (
      <span className="text-sm font-medium text-primary">
        {getUserFullName(info.row.original)}
      </span>
    ),
    size: 180,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => (
      <span className="text-xs capitalize text-secondary">
        {info.getValue()}
      </span>
    ),
    size: 80,
  }),
  columnHelper.accessor('banStatus', {
    header: 'Status',
    cell: (info) => {
      const config = STATUS_CONFIG[info.getValue()]
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
        >
          {config.label}
        </span>
      )
    },
    size: 100,
  }),
  columnHelper.accessor('warningsCount', {
    header: 'Warnings',
    cell: (info) => {
      const count = info.getValue()
      return (
        <span
          className={`text-sm font-medium ${count >= 3 ? 'text-danger' : count >= 1 ? 'text-warning' : 'text-muted'}`}
        >
          {count}
        </span>
      )
    },
    size: 80,
  }),
  columnHelper.accessor('lastActive', {
    header: 'Last Active',
    cell: (info) => (
      <span className="text-xs text-muted">{formatDate(info.getValue())}</span>
    ),
    size: 110,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (info) => (
      <Link
        to="/users/$userId"
        params={{ userId: info.row.original.id }}
        className="inline-flex items-center gap-1 text-xs font-medium text-accent no-underline"
      >
        <ExternalLink size={14} />
        View
      </Link>
    ),
    size: 70,
  }),
]
