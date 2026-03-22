import {
  ArrowRightLeft,
  Check,
  Eye,
  MessageSquare,
  Plus,
  UserPlus,
  X,
} from 'lucide-react'

import { formatDateTime } from '#/lib/mock-data'
import type { AuditAction, AuditEntry } from '#/lib/types'

const ACTION_ICONS: Record<AuditAction, typeof Plus> = {
  created: Plus,
  status_changed: ArrowRightLeft,
  assigned: UserPlus,
  note_added: MessageSquare,
  resolved: Check,
  dismissed: X,
  evidence_reviewed: Eye,
}

const ACTION_LABELS: Record<AuditAction, string> = {
  created: 'Created',
  status_changed: 'Status Changed',
  assigned: 'Assigned',
  note_added: 'Note Added',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
  evidence_reviewed: 'Evidence Reviewed',
}

interface AuditTimelineProps {
  entries: AuditEntry[]
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted">No audit entries.</p>
  }

  return (
    <div className="border-l-2 border-border pl-4">
      {entries.map((entry) => {
        const Icon = ACTION_ICONS[entry.action]
        return (
          <div key={entry.id} className="relative mb-4 last:mb-0">
            <div className="absolute -left-[21px] flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised ring-2 ring-border">
              <Icon size={10} className="text-muted" />
            </div>
            <p className="text-xs font-semibold text-primary">
              {ACTION_LABELS[entry.action]}
            </p>
            <p className="text-xs text-secondary">{entry.details}</p>
            <p className="mt-0.5 text-[10px] text-muted">
              {formatDateTime(entry.createdAt)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
