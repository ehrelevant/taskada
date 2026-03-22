import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, Clock, Eye, Flag, Users } from 'lucide-react'

import { DashboardCard } from '#/components/DashboardCard'
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import {
  MOCK_REPORTS,
  formatDate,
  getReportedUserForReport,
  getReporterForReport,
  getUserFullName,
} from '#/lib/mock-data'

export const Route = createFileRoute('/_auth/')({ component: Dashboard })

function Dashboard() {
  const openReports = MOCK_REPORTS.filter((r) => r.status === 'open')
  const underReview = MOCK_REPORTS.filter((r) => r.status === 'under_review')
  const resolvedToday = MOCK_REPORTS.filter((r) => r.status === 'resolved')
  const recentReports = [...MOCK_REPORTS]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Open Reports"
          value={openReports.length}
          icon={AlertTriangle}
          iconBgClass="bg-danger-subtle"
          iconTextClass="text-danger"
        />
        <DashboardCard
          title="Under Review"
          value={underReview.length}
          icon={Eye}
          iconBgClass="bg-warning-subtle"
          iconTextClass="text-warning"
        />
        <DashboardCard
          title="Resolved"
          value={resolvedToday.length}
          icon={Flag}
          iconBgClass="bg-success-subtle"
          iconTextClass="text-success"
        />
        <DashboardCard
          title="Total Reports"
          value={MOCK_REPORTS.length}
          icon={Users}
          iconBgClass="bg-accent-subtle"
          iconTextClass="text-accent"
        />
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Clock size={16} />
            Recent Reports
          </h2>
          <Link
            to="/reports"
            className="text-xs font-medium text-accent no-underline"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-border-subtle">
          {recentReports.map((report) => {
            const reporter = getReporterForReport(report)
            const reported = getReportedUserForReport(report)

            return (
              <Link
                key={report.id}
                to="/reports/$reportId"
                params={{ reportId: report.id }}
                className="flex items-center justify-between gap-4 px-5 py-3.5 text-primary no-underline transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <StatusBadge reason={report.reason} />
                    <ModerationStatusBadge status={report.status} />
                  </div>
                  <p className="truncate text-sm text-secondary">
                    {reporter ? getUserFullName(reporter) : 'Unknown'} →{' '}
                    {reported ? getUserFullName(reported) : 'Unknown'}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {formatDate(report.createdAt)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
