import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  FileText,
  Image,
  ScrollText,
  User,
} from 'lucide-react'
import { useForm } from 'react-hook-form'

import { AuditTimeline } from '#/components/AuditTimeline'
import { ImageLightbox } from '#/components/ImageLightbox'
import { NotesThread } from '#/components/NotesThread'
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge'
import { UserHistory } from '#/components/UserHistory'
import {
  formatDateTime,
  getAuditEntriesForReport,
  getBookingForReport,
  getNotesForReport,
  getReportById,
  getReportedUserForReport,
  getReporterForReport,
  getUserFullName,
} from '#/lib/mock-data'
import type { ReportStatus } from '#/lib/types'

interface ResolutionFormValues {
  action: ReportStatus
  notes: string
}

export const Route = createFileRoute('/_auth/reports/$reportId')({
  component: ReportDetail,
})

function ReportDetail() {
  const { reportId } = Route.useParams()
  const router = useRouter()
  const report = getReportById(reportId)
  const [currentStatus, setCurrentStatus] = useState<ReportStatus | null>(
    report?.status ?? null,
  )
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResolutionFormValues>({
    defaultValues: {
      action: 'resolved',
      notes: '',
    },
  })

  if (!report) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-lg font-medium text-primary">
          Report not found
        </p>
        <Link
          to="/reports"
          className="text-sm font-medium text-accent no-underline"
        >
          Back to Reports
        </Link>
      </div>
    )
  }

  const reporter = getReporterForReport(report)
  const reported = getReportedUserForReport(report)
  const booking = getBookingForReport(report)
  const auditEntries = getAuditEntriesForReport(report.id)
  const notes = getNotesForReport(report.id)

  const onSubmit = (values: ResolutionFormValues) => {
    setCurrentStatus(values.action)
    alert(
      `Mock: Report ${report.id} ${values.action}. Notes: ${values.notes || '(none)'}`,
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="cursor-pointer rounded-lg border border-border p-2 text-secondary transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-primary">Report {report.id}</h1>
          <p className="text-xs text-muted">
            Submitted {formatDateTime(report.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <FileText size={16} />
                Report Details
              </h2>
              <div className="flex items-center gap-2">
                <StatusBadge reason={report.reason} />
                <ModerationStatusBadge
                  status={currentStatus ?? report.status}
                />
              </div>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm leading-relaxed text-secondary">
                {report.description ?? 'No description provided.'}
              </p>
              {report.reportImages.length > 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    <Image size={14} />
                    Evidence ({report.reportImages.length})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {report.reportImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setLightboxIndex(idx)}
                        className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-border bg-surface-raised text-center transition-colors hover:bg-surface-hover"
                      >
                        <Image size={20} className="text-muted" />
                        <span className="mt-1 px-1 text-[10px] text-muted">
                          {img.caption ?? 'Image'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-primary">Resolution</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Action
                </label>
                <select
                  {...register('action', { required: true })}
                  className="w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-primary outline-none"
                >
                  <option value="resolved">Resolve</option>
                  <option value="dismissed">Dismiss</option>
                  <option value="under_review">Mark Under Review</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Notes
                </label>
                <textarea
                  {...register('notes', {
                    validate: (v, formValues) => {
                      if (formValues.action === 'resolved' && !v.trim()) {
                        return 'Notes are required when resolving a report.'
                      }
                      return true
                    },
                  })}
                  rows={4}
                  placeholder="Add resolution notes..."
                  className="w-full resize-none rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-primary outline-none"
                />
                {errors.notes && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.notes.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Submit Resolution
              </button>
            </form>
          </div>

          <NotesThread reportId={report.id} initialNotes={notes} />
        </div>

        <div className="flex flex-col gap-6">
          <InfoCard
            title="Reporter"
            user={reporter ? getUserFullName(reporter) : 'Unknown'}
            subtitle={reporter?.email ?? ''}
            icon={User}
          />
          <UserHistory
            userId={report.reporterUserId}
            excludeReportId={report.id}
          />
          <InfoCard
            title="Reported User"
            user={reported ? getUserFullName(reported) : 'Unknown'}
            subtitle={reported?.email ?? ''}
            icon={User}
          />
          <UserHistory
            userId={report.reportedUserId}
            excludeReportId={report.id}
          />
          {booking && (
            <div className="rounded-xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <ExternalLink size={16} />
                  Booking
                </h3>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <DetailRow label="ID" value={booking.id} />
                <DetailRow
                  label="Status"
                  value={booking.status.replace('_', ' ')}
                />
                <DetailRow
                  label="Cost"
                  value={`₱${booking.cost.toLocaleString()}`}
                />
                <DetailRow
                  label="Date"
                  value={formatDateTime(booking.createdAt)}
                />
                {booking.specifications && (
                  <DetailRow label="Notes" value={booking.specifications} />
                )}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Clock size={16} />
                Timeline
              </h3>
            </div>
            <div className="flex flex-col gap-2 p-5">
              <DetailRow
                label="Created"
                value={formatDateTime(report.createdAt)}
              />
              <DetailRow
                label="Updated"
                value={formatDateTime(report.updatedAt)}
              />
              <DetailRow
                label="Status"
                value={currentStatus ?? report.status}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ScrollText size={16} />
                Audit Trail
              </h3>
            </div>
            <div className="p-5">
              <AuditTimeline entries={auditEntries} />
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={report.reportImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}

function InfoCard({
  title,
  user,
  subtitle,
  icon: Icon,
}: {
  title: string
  user: string
  subtitle: string
  icon: typeof User
}) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Icon size={16} />
          {title}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-primary">{user}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium capitalize text-secondary">{value}</span>
    </div>
  )
}
