import { API_URL } from '#/lib/env'
import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { getReports } from '@repo/shared/api/moderation'
import { reportColumns } from '#/lib/table-columns'
import { ReportsTable } from '#/components/ReportsTable'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_auth/reports/')({
  component: ReportsList,
})

function ReportsList() {
  const { data } = useQuery({
    queryKey: ['reports', { limit: 100 }],
    queryFn: () => getReports(authClient as never, API_URL, { limit: 100 }),
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-primary text-2xl font-bold">Reports</h1>
        <p className="text-muted mt-1 text-sm">Manage and review user-submitted reports</p>
      </div>

      <ReportsTable data={data?.data ?? []} columns={reportColumns} />
    </div>
  )
}
