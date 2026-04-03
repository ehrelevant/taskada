import { ArrowRightLeft, Check, Eye, MessageSquare, Plus, UserPlus, X } from 'lucide-react';
import type { AuditAction, AuditLogEntry } from '@repo/types';

import { formatDateTime } from '#/lib/format';

const ACTION_ICONS: Record<AuditAction, typeof Plus> = {
  created: Plus,
  status_changed: ArrowRightLeft,
  assigned: UserPlus,
  note_added: MessageSquare,
  resolved: Check,
  dismissed: X,
  evidence_reviewed: Eye,
};

const ACTION_LABELS: Record<AuditAction, string> = {
  created: 'Created',
  status_changed: 'Status Changed',
  assigned: 'Assigned',
  note_added: 'Note Added',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  evidence_reviewed: 'Evidence Reviewed',
};

interface AuditTimelineProps {
  entries: AuditLogEntry[];
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-muted text-sm">No audit entries.</p>;
  }

  return (
    <div className="border-border border-l-2 pl-4">
      {entries.map(entry => {
        const Icon = ACTION_ICONS[entry.action];
        return (
          <div key={entry.id} className="relative mb-4 last:mb-0">
            <div className="bg-surface-raised ring-border -left-5.25 absolute flex h-4 w-4 items-center justify-center rounded-full ring-2">
              <Icon size={10} className="text-muted" />
            </div>
            <p className="text-primary text-xs font-semibold">{ACTION_LABELS[entry.action]}</p>
            <p className="text-secondary text-xs">{entry.details}</p>
            <p className="text-muted mt-0.5 text-[10px]">{formatDateTime(entry.createdAt)}</p>
          </div>
        );
      })}
    </div>
  );
}
