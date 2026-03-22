import type {
  AuditLogEntry,
  DashboardStats,
  ModerationNote,
  ModerationReport,
  ModerationUser,
  PaginatedResponse,
} from '@repo/types';

import { apiFetch } from './apiFetch';

type AuthClient = { getCookie: () => string };

export async function checkAdminRole(authClient: AuthClient, baseUrl: string): Promise<boolean> {
  try {
    const response = await apiFetch(authClient, baseUrl, '/moderation/dashboard', 'GET');
    return response.ok;
  } catch {
    return false;
  }
}

export async function getDashboardStats(authClient: AuthClient, baseUrl: string): Promise<DashboardStats> {
  const response = await apiFetch(authClient, baseUrl, '/moderation/dashboard', 'GET');
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
}

export async function getReports(
  authClient: AuthClient,
  baseUrl: string,
  params: { status?: string; page?: number; limit?: number; search?: string },
): Promise<PaginatedResponse<ModerationReport>> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  const response = await apiFetch(authClient, baseUrl, `/moderation/reports?${query.toString()}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
}

export async function getReportById(
  authClient: AuthClient,
  baseUrl: string,
  reportId: string,
): Promise<ModerationReport> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/reports/${reportId}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch report');
  return response.json();
}

export async function updateReportStatus(
  authClient: AuthClient,
  baseUrl: string,
  reportId: string,
  status: string,
  notes?: string,
): Promise<void> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/reports/${reportId}/status`, 'PATCH', {
    body: JSON.stringify({ status, notes }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update report status' }));
    throw new Error(error.message || 'Failed to update report status');
  }
}

export async function getReportNotes(
  authClient: AuthClient,
  baseUrl: string,
  reportId: string,
): Promise<ModerationNote[]> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/reports/${reportId}/notes`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
}

export async function createReportNote(
  authClient: AuthClient,
  baseUrl: string,
  reportId: string,
  content: string,
): Promise<ModerationNote> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/reports/${reportId}/notes`, 'POST', {
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create note' }));
    throw new Error(error.message || 'Failed to create note');
  }
  return response.json();
}

export async function getAuditLog(
  authClient: AuthClient,
  baseUrl: string,
  params: { page?: number; limit?: number; search?: string; reportId?: string } = {},
): Promise<PaginatedResponse<AuditLogEntry>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  let endpoint: string;
  if (params.reportId) {
    endpoint = `/moderation/reports/${params.reportId}/audit`;
  } else {
    endpoint = `/moderation/audit-log?${query.toString()}`;
  }

  const response = await apiFetch(authClient, baseUrl, endpoint, 'GET');
  if (!response.ok) throw new Error('Failed to fetch audit log');
  return response.json();
}

export async function getUsers(
  authClient: AuthClient,
  baseUrl: string,
  params: { page?: number; limit?: number; search?: string },
): Promise<PaginatedResponse<ModerationUser>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);

  const response = await apiFetch(authClient, baseUrl, `/moderation/users?${query.toString()}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function getUserById(authClient: AuthClient, baseUrl: string, userId: string): Promise<ModerationUser> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/users/${userId}`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

export async function getUserReports(
  authClient: AuthClient,
  baseUrl: string,
  userId: string,
): Promise<ModerationReport[]> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/users/${userId}/reports`, 'GET');
  if (!response.ok) throw new Error('Failed to fetch user reports');
  return response.json();
}

export async function moderateUser(
  authClient: AuthClient,
  baseUrl: string,
  userId: string,
  action: string,
  durationDays?: number,
  message?: string,
): Promise<ModerationUser> {
  const response = await apiFetch(authClient, baseUrl, `/moderation/users/${userId}/moderate`, 'POST', {
    body: JSON.stringify({ action, durationDays, message }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to moderate user' }));
    throw new Error(error.message || 'Failed to moderate user');
  }
  return response.json();
}
