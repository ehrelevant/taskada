import type { AuditAction, AuditLogEntry } from '@repo/types';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDateTime } from '#/lib/format';

const ACTION_LABELS: Record<AuditAction, string> = {
  created: 'Created',
  status_changed: 'Status Changed',
  assigned: 'Assigned',
  note_added: 'Note Added',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  evidence_reviewed: 'Evidence Reviewed',
};

const columnHelper = createColumnHelper<AuditLogEntry>();

export const auditColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <span className="text-muted font-mono text-xs">{info.getValue().slice(0, 8)}</span>,
    size: 80,
  }),
  columnHelper.accessor('reportId', {
    header: 'Report',
    cell: info => <span className="text-accent font-mono text-xs">{info.getValue().slice(0, 8)}</span>,
    size: 100,
  }),
  columnHelper.accessor('action', {
    header: 'Action',
    cell: info => <span className="text-secondary text-xs font-medium">{ACTION_LABELS[info.getValue()]}</span>,
    size: 140,
  }),
  columnHelper.accessor('details', {
    header: 'Details',
    cell: info => <span className="text-secondary text-sm">{info.getValue() ?? '-'}</span>,
    size: 350,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: info => <span className="text-muted text-xs">{formatDateTime(info.getValue())}</span>,
    size: 160,
  }),
];
