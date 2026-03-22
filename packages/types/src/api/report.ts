export type ReportReason =
  | 'harassment'
  | 'fraudulent_payment'
  | 'unfair_cancellation'
  | 'no_show'
  | 'inappropriate_behavior'
  | 'poor_service'
  | 'other';

export interface CreateReportPayload {
  reportedUserId: string;
  bookingId: string;
  reason: ReportReason;
  description?: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  bookingId: string;
  reason: ReportReason;
  description: string | null;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}
