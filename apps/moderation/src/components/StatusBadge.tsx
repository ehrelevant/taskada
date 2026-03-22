import type { ReportReason } from '#/lib/types'

const REASON_CONFIG: Record<ReportReason, { label: string; classes: string }> =
  {
    harassment: {
      label: 'Harassment',
      classes: 'bg-danger-subtle text-danger',
    },
    fraudulent_payment: {
      label: 'Fraud',
      classes: 'bg-warning-subtle text-warning',
    },
    unfair_cancellation: {
      label: 'Unfair Cancel',
      classes: 'bg-info-subtle text-info',
    },
    no_show: {
      label: 'No Show',
      classes: 'bg-warning-subtle text-warning',
    },
    inappropriate_behavior: {
      label: 'Inappropriate',
      classes: 'bg-danger-subtle text-danger',
    },
    poor_service: {
      label: 'Poor Service',
      classes: 'bg-info-subtle text-info',
    },
    other: {
      label: 'Other',
      classes: 'bg-accent-subtle text-accent',
    },
  }

interface StatusBadgeProps {
  reason: ReportReason
}

export function StatusBadge({ reason }: StatusBadgeProps) {
  const config = REASON_CONFIG[reason]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  )
}

const MODERATION_STATUS_CONFIG: Record<
  string,
  { label: string; classes: string }
> = {
  open: {
    label: 'Open',
    classes: 'bg-danger-subtle text-danger',
  },
  under_review: {
    label: 'Under Review',
    classes: 'bg-warning-subtle text-warning',
  },
  resolved: {
    label: 'Resolved',
    classes: 'bg-success-subtle text-success',
  },
  dismissed: {
    label: 'Dismissed',
    classes: 'bg-accent-subtle text-accent',
  },
}

interface ModerationStatusBadgeProps {
  status: string
}

export function ModerationStatusBadge({ status }: ModerationStatusBadgeProps) {
  const config =
    MODERATION_STATUS_CONFIG[status] ?? MODERATION_STATUS_CONFIG.open

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  )
}
