import { API_URL } from '#/lib/env';
import { ArrowLeft, Clock, ExternalLink, FileText, Image, ScrollText, User } from 'lucide-react';
import { AuditTimeline } from '#/components/AuditTimeline';
import { authClient } from '#/lib/auth-client';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { formatDateTime } from '#/lib/format';
import {
  getAuditLog as getReportAudit,
  getReportById,
  getReportNotes,
  updateReportStatus,
} from '@repo/shared/api/moderation';
import { ImageLightbox } from '#/components/ImageLightbox';
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge';
import { NotesThread } from '#/components/NotesThread';
import type { ReportStatus } from '@repo/types';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserHistory } from '#/components/UserHistory';
import { useState } from 'react';

interface ResolutionFormValues {
  action: ReportStatus;
  notes: string;
}

export const Route = createFileRoute('/_auth/reports/$reportId')({
  component: ReportDetail,
});

function ReportDetail() {
  const { reportId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReportById(authClient as never, API_URL, reportId),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['report-notes', reportId],
    queryFn: () => getReportNotes(authClient as never, API_URL, reportId),
  });

  const { data: auditData } = useQuery({
    queryKey: ['report-audit', reportId],
    queryFn: () => getReportAudit(authClient as never, API_URL, { reportId }),
  });

  const resolveMutation = useMutation({
    mutationFn: (values: { status: string; notes?: string }) =>
      updateReportStatus(authClient as never, API_URL, reportId, values.status, values.notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['report-audit', reportId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResolutionFormValues>({
    defaultValues: {
      action: 'resolved',
      notes: '',
    },
  });

  if (isLoading) {
    return <div className="text-muted py-16 text-center text-sm">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="py-16 text-center">
        <p className="text-primary mb-4 text-lg font-medium">Report not found</p>
        <Link to="/reports" className="text-accent text-sm font-medium no-underline">
          Back to Reports
        </Link>
      </div>
    );
  }

  const auditEntries = auditData?.data ?? [];
  const images = report.images ?? [];

  const onSubmit = (values: ResolutionFormValues) => {
    resolveMutation.mutate({ status: values.action, notes: values.notes });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="border-border text-secondary cursor-pointer rounded-lg border p-2 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-primary text-xl font-bold">Report {report.id.slice(0, 8)}</h1>
          <p className="text-muted text-xs">Submitted {formatDateTime(report.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
                <FileText size={16} />
                Report Details
              </h2>
              <div className="flex items-center gap-2">
                <StatusBadge reason={report.reason} />
                <ModerationStatusBadge status={report.status} />
              </div>
            </div>
            <div className="p-5">
              <p className="text-secondary mb-4 text-sm leading-relaxed">
                {report.description ?? 'No description provided.'}
              </p>
              {images.length > 0 && (
                <div>
                  <h3 className="text-muted mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                    <Image size={14} />
                    Evidence ({images.length})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, idx) =>
                      img.url ? (
                        <button
                          key={img.id}
                          onClick={() => setLightboxIndex(idx)}
                          className="border-border bg-surface-raised hover:bg-surface-hover flex max-h-32 max-w-32 cursor-pointer flex-col items-center justify-center rounded-lg border p-2 text-center transition-colors"
                        >
                          <img src={img.url} alt={img.image} className="rounded-md" />
                        </button>
                      ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-primary text-sm font-semibold">Resolution</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="mb-4">
                <label className="text-muted mb-1.5 block text-xs font-semibold uppercase tracking-wider">Action</label>
                <select
                  {...register('action', { required: true })}
                  className="border-border bg-surface-raised text-primary w-full rounded-lg border px-3 py-2 text-sm outline-none"
                >
                  <option value="resolved">Resolve</option>
                  <option value="dismissed">Dismiss</option>
                  <option value="under_review">Mark Under Review</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="text-muted mb-1.5 block text-xs font-semibold uppercase tracking-wider">Notes</label>
                <textarea
                  {...register('notes', {
                    validate: (v, formValues) => {
                      if (formValues.action === 'resolved' && !v.trim()) {
                        return 'Notes are required when resolving a report.';
                      }
                      return true;
                    },
                  })}
                  rows={4}
                  placeholder="Add resolution notes..."
                  className="border-border bg-surface-raised text-primary w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                />
                {errors.notes && <p className="text-danger mt-1 text-xs">{errors.notes.message}</p>}
              </div>
              <button
                type="submit"
                disabled={resolveMutation.isPending}
                className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
              >
                {resolveMutation.isPending ? 'Submitting...' : 'Submit Resolution'}
              </button>
            </form>
          </div>

          <NotesThread reportId={report.id} initialNotes={notes} />
        </div>

        <div className="flex flex-col gap-6">
          <InfoCard
            title="Reporter"
            user={report.reporterName || 'Unknown'}
            subtitle={report.reporterEmail ?? ''}
            icon={User}
          />
          <UserHistory userId={report.reporterUserId} excludeReportId={report.id} />
          <InfoCard
            title="Reported User"
            user={report.reportedName || 'Unknown'}
            subtitle={report.reportedEmail ?? ''}
            icon={User}
          />
          <UserHistory userId={report.reportedUserId} excludeReportId={report.id} />
          {report.booking && (
            <div className="border-border bg-surface rounded-xl border">
              <div className="border-border border-b px-5 py-4">
                <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
                  <ExternalLink size={16} />
                  Booking
                </h3>
              </div>
              <div className="flex flex-col gap-2 p-5">
                <DetailRow label="ID" value={report.booking.id} />
                <DetailRow label="Status" value={report.booking.status.replace('_', ' ')} />
                <DetailRow label="Cost" value={`₱${report.booking.cost.toLocaleString()}`} />
                <DetailRow label="Date" value={formatDateTime(report.booking.createdAt)} />
                {report.booking.specifications && <DetailRow label="Notes" value={report.booking.specifications} />}
              </div>
            </div>
          )}
          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Clock size={16} />
                Timeline
              </h3>
            </div>
            <div className="flex flex-col gap-2 p-5">
              <DetailRow label="Created" value={formatDateTime(report.createdAt)} />
              <DetailRow label="Updated" value={formatDateTime(report.updatedAt)} />
              <DetailRow label="Status" value={report.status} />
            </div>
          </div>
          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
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
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

function InfoCard({
  title,
  user,
  subtitle,
  icon: Icon,
}: {
  title: string;
  user: string;
  subtitle: string;
  icon: typeof User;
}) {
  return (
    <div className="border-border bg-surface rounded-xl border">
      <div className="border-border border-b px-5 py-4">
        <h3 className="text-primary flex items-center gap-2 text-sm font-semibold">
          <Icon size={16} />
          {title}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-primary text-sm font-medium">{user}</p>
        {subtitle && <p className="text-muted mt-0.5 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-secondary font-medium capitalize">{value}</span>
    </div>
  );
}
