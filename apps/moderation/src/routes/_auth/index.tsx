import { AlertTriangle, Clock, Eye, Flag, Users } from 'lucide-react'
import { API_URL } from '#/lib/env'
import { authClient } from '#/lib/auth-client'
import { createFileRoute, Link } from '@tanstack/react-router'
import { DashboardCard } from '#/components/DashboardCard'
import { formatDate } from '#/lib/format'
import { getDashboardStats, getReports } from '@repo/shared/api/moderation'
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_auth/')({ component: Dashboard })

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats(authClient as never, API_URL),
  })

  const { data: recentData } = useQuery({
    queryKey: ['reports', { limit: 5 }],
    queryFn: () => getReports(authClient as never, API_URL, { limit: 5 }),
  })

  const recentReports = recentData?.data ?? []

  return (
    <div>
      <h1 className="text-primary mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Open Reports"
          value={stats?.open ?? 0}
          icon={AlertTriangle}
          iconBgClass="bg-danger-subtle"
          iconTextClass="text-danger"
        />
        <DashboardCard
          title="Under Review"
          value={stats?.under_review ?? 0}
          icon={Eye}
          iconBgClass="bg-warning-subtle"
          iconTextClass="text-warning"
        />
        <DashboardCard
          title="Resolved"
          value={stats?.resolved ?? 0}
          icon={Flag}
          iconBgClass="bg-success-subtle"
          iconTextClass="text-success"
        />
        <DashboardCard
          title="Total Reports"
          value={stats?.total ?? 0}
          icon={Users}
          iconBgClass="bg-accent-subtle"
          iconTextClass="text-accent"
        />
      </div>

      <div className="border-border bg-surface rounded-xl border">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
            <Clock size={16} />
            Recent Reports
          </h2>
          <Link to="/reports" className="text-accent text-xs font-medium no-underline">
            View All
          </Link>
        </div>

        <div className="divide-border-subtle divide-y">
          {recentReports.map(report => (
            <Link
              key={report.id}
              to="/reports/$reportId"
              params={{ reportId: report.id }}
              className="text-primary hover:bg-surface-hover flex items-center justify-between gap-4 px-5 py-3.5 no-underline transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <StatusBadge reason={report.reason} />
                  <ModerationStatusBadge status={report.status} />
                </div>
                <p className="text-secondary truncate text-sm">
                  {report.reporterName || 'Unknown'} → {report.reportedName || 'Unknown'}
                </p>
              </div>
              <span className="text-muted shrink-0 text-xs">{formatDate(report.createdAt)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
