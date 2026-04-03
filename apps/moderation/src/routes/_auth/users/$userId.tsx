import { API_URL } from '#/lib/env';
import { ArrowLeft, Ban, Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { authClient } from '#/lib/auth-client';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { formatDate, getUserFullName } from '#/lib/format';
import { getUserById, getUserReports, moderateUser } from '@repo/shared/api/moderation';
import { ModerationStatusBadge, StatusBadge } from '#/components/StatusBadge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/_auth/users/$userId')({
  component: UserDetail,
});

function UserDetail() {
  const { userId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: adminUser, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(authClient as never, API_URL, userId),
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['user-reports', userId],
    queryFn: () => getUserReports(authClient as never, API_URL, userId),
  });

  const moderateMutation = useMutation({
    mutationFn: (params: { action: string; durationDays?: number; message?: string }) =>
      moderateUser(authClient as never, API_URL, userId, params.action, params.durationDays, params.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  if (isLoading) {
    return <div className="text-muted py-16 text-center text-sm">Loading...</div>;
  }

  if (!adminUser) {
    return (
      <div className="py-16 text-center">
        <p className="text-primary mb-4 text-lg font-medium">User not found</p>
        <Link to="/users" className="text-accent text-sm font-medium no-underline">
          Back to Users
        </Link>
      </div>
    );
  }

  const fullName = getUserFullName(adminUser);

  const handleBan = () => {
    if (window.confirm(`Ban ${fullName}? This cannot be undone.`)) {
      moderateMutation.mutate({ action: 'ban' });
    }
  };

  const handleSuspend = () => {
    const duration = window.prompt('Suspension duration in days:', '7');
    if (duration) {
      moderateMutation.mutate({
        action: 'suspend',
        durationDays: parseInt(duration),
      });
    }
  };

  const handleWarn = () => {
    const message = window.prompt('Warning message:', '');
    if (message) {
      moderateMutation.mutate({ action: 'warn', message });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.history.back()}
          className="border-border text-secondary rounded-lg border p-2 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-primary text-xl font-bold">{fullName}</h1>
          <p className="text-muted text-xs">{adminUser.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-6">
          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Shield size={16} />
                Profile
              </h2>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <DetailRow label="Name" value={fullName} />
              <DetailRow icon={Mail} label="Email" value={adminUser.email} />
              <DetailRow icon={Phone} label="Phone" value={adminUser.phoneNumber} />
              <DetailRow icon={UserIcon} label="Role" value={adminUser.role ?? '-'} />
              <DetailRow label="Status" value={adminUser.banStatus} />
              <DetailRow label="Warnings" value={String(adminUser.warningsCount)} />
              <DetailRow label="Joined" value={formatDate(adminUser.createdAt)} />
            </div>
          </div>

          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-primary text-sm font-semibold">Actions</h2>
            </div>
            <div className="flex gap-3 p-5">
              <button
                onClick={handleBan}
                disabled={adminUser.banStatus === 'banned' || moderateMutation.isPending}
                className="border-danger/30 bg-danger-subtle text-danger hover:bg-danger/20 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
              >
                Ban User
              </button>
              <button
                onClick={handleSuspend}
                disabled={
                  adminUser.banStatus === 'suspended' || adminUser.banStatus === 'banned' || moderateMutation.isPending
                }
                className="border-warning/30 bg-warning-subtle text-warning hover:bg-warning/20 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
              >
                Suspend
              </button>
              <button
                onClick={handleWarn}
                disabled={moderateMutation.isPending}
                className="border-border text-secondary hover:bg-surface-hover rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
              >
                Issue Warning
              </button>
            </div>
          </div>

          <div className="border-border bg-surface rounded-xl border">
            <div className="border-border border-b px-5 py-4">
              <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Ban size={16} />
                Report History ({reports.length})
              </h2>
            </div>
            {reports.length === 0 ? (
              <p className="text-muted p-5 text-sm">No reports involving this user.</p>
            ) : (
              <div className="divide-border-subtle divide-y">
                {reports.map(r => {
                  const isReporter = r.reporterUserId === userId;
                  return (
                    <Link
                      key={r.id}
                      to="/reports/$reportId"
                      params={{ reportId: r.id }}
                      className="text-primary hover:bg-surface-hover flex items-center justify-between gap-4 px-5 py-3.5 no-underline transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge reason={r.reason} />
                        <ModerationStatusBadge status={r.status} />
                        <span className="text-muted text-xs">{isReporter ? 'as reporter' : 'as reported'}</span>
                      </div>
                      <span className="text-muted shrink-0 text-xs">{formatDate(r.createdAt)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof UserIcon }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted flex items-center gap-2">
        {Icon && <Icon size={14} />}
        {label}
      </span>
      <span className="text-secondary font-medium capitalize">{value}</span>
    </div>
  );
}
