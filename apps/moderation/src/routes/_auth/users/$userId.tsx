import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  Ban,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
} from 'lucide-react'

import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import {
  formatDate,
  formatDateTime,
  getAdminUserById,
  getReportsForUser,
  getUserFullName,
} from '#/lib/mock-data'
import type { BanStatus } from '#/lib/types'

export const Route = createFileRoute('/_auth/users/$userId')({
  component: UserDetail,
})

function UserDetail() {
  const { userId } = Route.useParams()
  const router = useRouter()
  const adminUser = getAdminUserById(userId)
  const [banStatus, setBanStatus] = useState<BanStatus>(
    adminUser?.banStatus ?? 'active',
  )

  if (!adminUser) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-lg font-medium text-primary">User not found</p>
        <Link
          to="/users"
          className="text-sm font-medium text-accent no-underline"
        >
          Back to Users
        </Link>
      </div>
    )
  }

  const reports = getReportsForUser(userId)

  const handleBan = () => {
    if (
      window.confirm(
        `Ban ${getUserFullName(adminUser)}? This cannot be undone.`,
      )
    ) {
      setBanStatus('banned')
      alert(`Mock: ${getUserFullName(adminUser)} has been banned.`)
    }
  }

  const handleSuspend = () => {
    const duration = window.prompt('Suspension duration in days:', '7')
    if (duration) {
      setBanStatus('suspended')
      alert(
        `Mock: ${getUserFullName(adminUser)} suspended for ${duration} days.`,
      )
    }
  }

  const handleWarn = () => {
    const message = window.prompt('Warning message:', '')
    if (message) {
      alert(
        `Mock: Warning issued to ${getUserFullName(adminUser)}: "${message}"`,
      )
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="rounded-lg border border-border p-2 text-secondary transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-primary">
            {getUserFullName(adminUser)}
          </h1>
          <p className="text-xs text-muted">{adminUser.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Shield size={16} />
                Profile
              </h2>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <DetailRow label="Name" value={getUserFullName(adminUser)} />
              <DetailRow icon={Mail} label="Email" value={adminUser.email} />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={adminUser.phoneNumber}
              />
              <DetailRow icon={UserIcon} label="Role" value={adminUser.role} />
              <DetailRow label="Status" value={banStatus} />
              <DetailRow
                label="Warnings"
                value={String(adminUser.warningsCount)}
              />
              <DetailRow
                label="Last Active"
                value={formatDateTime(adminUser.lastActive)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-primary">Actions</h2>
            </div>
            <div className="flex gap-3 p-5">
              <button
                onClick={handleBan}
                disabled={banStatus === 'banned'}
                className="rounded-lg border border-danger/30 bg-danger-subtle px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-30"
              >
                Ban User
              </button>
              <button
                onClick={handleSuspend}
                disabled={banStatus === 'suspended' || banStatus === 'banned'}
                className="rounded-lg border border-warning/30 bg-warning-subtle px-4 py-2 text-sm font-medium text-warning transition-colors hover:bg-warning/20 disabled:opacity-30"
              >
                Suspend
              </button>
              <button
                onClick={handleWarn}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-hover"
              >
                Issue Warning
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Ban size={16} />
                Report History ({reports.length})
              </h2>
            </div>
            {reports.length === 0 ? (
              <p className="p-5 text-sm text-muted">
                No reports involving this user.
              </p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {reports.map((r) => {
                  const isReporter = r.reporterUserId === userId
                  return (
                    <Link
                      key={r.id}
                      to="/reports/$reportId"
                      params={{ reportId: r.id }}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 text-primary no-underline transition-colors hover:bg-surface-hover"
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge reason={r.reason} />
                        <ModerationStatusBadge status={r.status} />
                        <span className="text-xs text-muted">
                          {isReporter ? 'as reporter' : 'as reported'}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {formatDate(r.createdAt)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: typeof UserIcon
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <span className="font-medium capitalize text-secondary">{value}</span>
    </div>
  )
}
