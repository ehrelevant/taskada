import { createFileRoute } from '@tanstack/react-router'

import { ReportsTable } from '#/components/ReportsTable'
import { MOCK_REPORTS } from '#/lib/mock-data'
import { reportColumns } from '#/lib/table-columns'

export const Route = createFileRoute('/_auth/reports/')({
  component: ReportsList,
})

function ReportsList() {
  const sortedReports = [...MOCK_REPORTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Manage and review user-submitted reports
        </p>
      </div>

      <ReportsTable data={sortedReports} columns={reportColumns} />
    </div>
  )
}
