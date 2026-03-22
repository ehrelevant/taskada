import { createColumnHelper } from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import {
  formatDate,
  getReportedUserForReport,
  getReporterForReport,
  getUserFullName,
} from '#/lib/mock-data'
import type { Report } from '#/lib/types'

const columnHelper = createColumnHelper<Report>()

export const reportColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-muted">
        {info.getValue().slice(0, 8)}
      </span>
    ),
    size: 80,
  }),
  columnHelper.accessor('reason', {
    header: 'Reason',
    cell: (info) => <StatusBadge reason={info.getValue()} />,
    size: 130,
  }),
  columnHelper.display({
    id: 'status',
    header: 'Status',
    cell: (info) => <ModerationStatusBadge status={info.row.original.status} />,
    size: 110,
  }),
  columnHelper.display({
    id: 'reporter',
    header: 'Reporter',
    cell: (info) => {
      const user = getReporterForReport(info.row.original)
      return (
        <span className="text-secondary">
          {user ? getUserFullName(user) : 'Unknown'}
        </span>
      )
    },
    size: 160,
  }),
  columnHelper.display({
    id: 'reported',
    header: 'Reported',
    cell: (info) => {
      const user = getReportedUserForReport(info.row.original)
      return (
        <span className="text-secondary">
          {user ? getUserFullName(user) : 'Unknown'}
        </span>
      )
    },
    size: 160,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => (
      <span className="text-xs text-muted">{formatDate(info.getValue())}</span>
    ),
    size: 100,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: (info) => (
      <Link
        to="/reports/$reportId"
        params={{ reportId: info.row.original.id }}
        className="inline-flex items-center gap-1 text-xs font-medium text-accent no-underline"
      >
        <ExternalLink size={14} />
        View
      </Link>
    ),
    size: 70,
  }),
]
