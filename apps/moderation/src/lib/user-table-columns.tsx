import type { BanStatus, ModerationUser } from '@repo/types'
import { createColumnHelper } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { formatDate } from '#/lib/format'
import { Link } from '@tanstack/react-router'

const STATUS_CONFIG: Record<BanStatus, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-success-subtle text-success' },
  suspended: { label: 'Suspended', classes: 'bg-warning-subtle text-warning' },
  banned: { label: 'Banned', classes: 'bg-danger-subtle text-danger' },
}

const columnHelper = createColumnHelper<ModerationUser>()

export const userColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <span className="text-muted font-mono text-xs">{info.getValue().slice(0, 8)}</span>,
    size: 80,
  }),
  columnHelper.display({
    id: 'name',
    header: 'Name',
    cell: info => {
      const u = info.row.original
      const name = [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ')
      return <span className="text-primary text-sm font-medium">{name}</span>
    },
    size: 180,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: info => <span className="text-secondary text-xs capitalize">{info.getValue() ?? '-'}</span>,
    size: 80,
  }),
  columnHelper.accessor('banStatus', {
    header: 'Status',
    cell: info => {
      const config = STATUS_CONFIG[info.getValue()]
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
          {config.label}
        </span>
      )
    },
    size: 100,
  }),
  columnHelper.accessor('warningsCount', {
    header: 'Warnings',
    cell: info => {
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
  columnHelper.accessor('createdAt', {
    header: 'Joined',
    cell: info => <span className="text-muted text-xs">{formatDate(info.getValue())}</span>,
    size: 110,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: info => (
      <Link
        to="/users/$userId"
        params={{ userId: info.row.original.id }}
        className="text-accent inline-flex items-center gap-1 text-xs font-medium no-underline"
      >
        <ExternalLink size={14} />
        View
      </Link>
    ),
    size: 70,
  }),
]
