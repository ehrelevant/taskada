export type ReportReason =
  | 'harassment'
  | 'fraudulent_payment'
  | 'unfair_cancellation'
  | 'no_show'
  | 'inappropriate_behavior'
  | 'poor_service'
  | 'other'

export type BookingStatus = 'in_transit' | 'serving' | 'completed' | 'cancelled'

export type UserRole = 'provider' | 'seeker' | 'admin'

export type ReportStatus = 'open' | 'under_review' | 'resolved' | 'dismissed'

export interface User {
  id: string
  email: string
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  avatarUrl: string | null
  role: UserRole
}

export interface Booking {
  id: string
  providerUserId: string
  seekerUserId: string
  serviceId: string
  status: BookingStatus
  cost: number
  specifications: string | null
  createdAt: string
  updatedAt: string
}

export interface ReportImage {
  id: string
  url: string
  caption: string | null
}

export interface Report {
  id: string
  reporterUserId: string
  reportedUserId: string
  bookingId: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  createdAt: string
  updatedAt: string
  reportImages: ReportImage[]
}

export interface ResolutionAction {
  reportId: string
  action: ReportStatus
  notes: string
  moderatorId: string
  createdAt: string
}

export type AuditAction =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'note_added'
  | 'resolved'
  | 'dismissed'
  | 'evidence_reviewed'

export interface AuditEntry {
  id: string
  reportId: string
  moderatorId: string
  action: AuditAction
  details: string
  createdAt: string
}

export interface Note {
  id: string
  reportId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export type BanStatus = 'active' | 'suspended' | 'banned'

export interface AdminUser {
  id: string
  email: string
  firstName: string
  middleName: string
  lastName: string
  phoneNumber: string
  avatarUrl: string | null
  role: UserRole
  banStatus: BanStatus
  warningsCount: number
  lastActive: string
}
