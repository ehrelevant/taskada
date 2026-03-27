import type { ReportReason } from './report';

export type ReportStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';

export type BanStatus = 'active' | 'suspended' | 'banned';

export type AuditAction =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'note_added'
  | 'resolved'
  | 'dismissed'
  | 'evidence_reviewed';

export interface ModerationReport {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  bookingId: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  reporterName: string;
  reportedName: string;
  reporterEmail?: string;
  reportedEmail?: string;
  images?: { id: string; image: string; url: string | null }[];
  booking?: {
    id: string;
    status: string;
    cost: number;
    createdAt: string;
    specifications: string | null;
  };
}

export interface ModerationUser {
  id: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl: string | null;
  role: string | null;
  banStatus: BanStatus;
  warningsCount: number;
  suspendedUntil: string | null;
  createdAt: string;
}

export interface ModerationNote {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  reportId: string;
  moderatorId: string;
  moderatorName: string;
  action: AuditAction;
  details: string | null;
  createdAt: string;
}

export interface DashboardStats {
  open: number;
  under_review: number;
  resolved: number;
  dismissed: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
