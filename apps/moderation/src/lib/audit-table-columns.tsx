import { createColumnHelper } from '@tanstack/react-table'

import { formatDateTime } from '#/lib/mock-data'
import type { AuditAction, AuditEntry } from '#/lib/types'

const ACTION_LABELS: Record<AuditAction, string> = {
  created: 'Created',
  status_changed: 'Status Changed',
  assigned: 'Assigned',
  note_added: 'Note Added',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  evidence_reviewed: 'Evidence Reviewed',
}

const columnHelper = createColumnHelper<AuditEntry>()

export const auditColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-muted">
        {info.getValue().slice(0, 8)}
      </span>
    ),
    size: 80,
  }),
  columnHelper.accessor('reportId', {
    header: 'Report',
    cell: (info) => (
      <span className="font-mono text-xs text-accent">{info.getValue()}</span>
    ),
    size: 100,
  }),
  columnHelper.accessor('action', {
    header: 'Action',
    cell: (info) => (
      <span className="text-xs font-medium text-secondary">
        {ACTION_LABELS[info.getValue()]}
      </span>
    ),
    size: 140,
  }),
  columnHelper.accessor('details', {
    header: 'Details',
    cell: (info) => (
      <span className="text-sm text-secondary">{info.getValue()}</span>
    ),
    size: 350,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: (info) => (
      <span className="text-xs text-muted">
        {formatDateTime(info.getValue())}
      </span>
    ),
    size: 160,
  }),
]
