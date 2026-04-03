import { createColumnHelper } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import { formatDate } from '#/lib/format';
import { Link } from '@tanstack/react-router';
import type { ModerationReport } from '@repo/types';
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge';

const columnHelper = createColumnHelper<ModerationReport>();

export const reportColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <span className="text-muted font-mono text-xs">{info.getValue().slice(0, 8)}</span>,
    size: 80,
  }),
  columnHelper.accessor('reason', {
    header: 'Reason',
    cell: info => <StatusBadge reason={info.getValue()} />,
    size: 130,
  }),
  columnHelper.display({
    id: 'status',
    header: 'Status',
    cell: info => <ModerationStatusBadge status={info.row.original.status} />,
    size: 110,
  }),
  columnHelper.accessor('reporterName', {
    header: 'Reporter',
    cell: info => <span className="text-secondary">{info.getValue() || 'Unknown'}</span>,
    size: 160,
  }),
  columnHelper.accessor('reportedName', {
    header: 'Reported',
    cell: info => <span className="text-secondary">{info.getValue() || 'Unknown'}</span>,
    size: 160,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    cell: info => <span className="text-muted text-xs">{formatDate(info.getValue())}</span>,
    size: 100,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: info => (
      <Link
        to="/reports/$reportId"
        params={{ reportId: info.row.original.id }}
        className="text-accent inline-flex items-center gap-1 text-xs font-medium no-underline"
      >
        <ExternalLink size={14} />
        View
      </Link>
    ),
    size: 70,
  }),
];
