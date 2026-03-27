import { API_URL } from '#/lib/env'
import { authClient } from '#/lib/auth-client'
import { formatDate } from '#/lib/format'
import { getUserReports } from '@repo/shared/api/moderation'
import { History } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import { useQuery } from '@tanstack/react-query'

interface UserHistoryProps {
  userId: string
  excludeReportId: string
}

export function UserHistory({ userId, excludeReportId }: UserHistoryProps) {
  const { data: reports = [] } = useQuery({
    queryKey: ['user-reports', userId],
    queryFn: () => getUserReports(authClient as never, API_URL, userId),
  })

  const otherReports = reports.filter(r => r.id !== excludeReportId)

  return (
    <div className="border-border bg-surface rounded-xl border">
      <div className="border-border border-b px-5 py-4">
        <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
          <History size={16} />
          User History
        </h3>
      </div>
      <div className="p-5">
        <p className="text-muted mb-3 text-xs">
          {otherReports.length} other report
          {otherReports.length !== 1 ? 's' : ''} involving this user
        </p>
        {otherReports.length === 0 ? (
          <p className="text-muted text-sm">No other reports.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {otherReports.map(r => (
              <Link
                key={r.id}
                to="/reports/$reportId"
                params={{ reportId: r.id }}
                className="border-border-subtle text-primary hover:bg-surface-hover flex items-center justify-between gap-2 rounded-lg border px-3 py-2 no-underline transition-colors"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge reason={r.reason} />
                  <ModerationStatusBadge status={r.status} />
                </div>
                <span className="text-muted shrink-0 text-[10px]">{formatDate(r.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
