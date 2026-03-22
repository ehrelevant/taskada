import { Link } from '@tanstack/react-router'
import { History } from 'lucide-react'

import {
  formatDate,
  getReportsForUser,
  getUserById,
  getUserFullName,
} from '#/lib/mock-data'
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'

interface UserHistoryProps {
  userId: string
  excludeReportId: string
}

export function UserHistory({ userId, excludeReportId }: UserHistoryProps) {
  const allReports = getReportsForUser(userId)
  const otherReports = allReports.filter((r) => r.id !== excludeReportId)
  const user = getUserById(userId)

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
          <History size={16} />
          User History
        </h3>
      </div>
      <div className="p-5">
        <p className="mb-3 text-xs text-muted">
          {otherReports.length} other report
          {otherReports.length !== 1 ? 's' : ''} involving{' '}
          {user ? getUserFullName(user) : 'this user'}
        </p>
        {otherReports.length === 0 ? (
          <p className="text-sm text-muted">No other reports.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {otherReports.map((r) => (
              <Link
                key={r.id}
                to="/reports/$reportId"
                params={{ reportId: r.id }}
                className="flex items-center justify-between gap-2 rounded-lg border border-border-subtle px-3 py-2 text-primary no-underline transition-colors hover:bg-surface-hover"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge reason={r.reason} />
                  <ModerationStatusBadge status={r.status} />
                </div>
                <span className="shrink-0 text-[10px] text-muted">
                  {formatDate(r.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
