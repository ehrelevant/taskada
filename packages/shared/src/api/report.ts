import type { CreateReportPayload, Report } from '@repo/types';

import { apiFetch } from './apiFetch';

export async function createReport(
  authClient: { getCookie: () => string },
  baseUrl: string,
  payload: CreateReportPayload,
): Promise<Report> {
  const response = await apiFetch(authClient, baseUrl, '/reports', 'POST', {
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create report');
  }

  return response.json();
}

export async function uploadReportImages(
  authClient: { getCookie: () => string },
  baseUrl: string,
  reportId: string,
  imageUris: string[],
): Promise<string[]> {
  const cookies = authClient.getCookie();

  const formData = new FormData();

  for (const uri of imageUris) {
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('files', {
      uri,
      name: filename,
      type,
    } as unknown as Blob);
  }

  const response = await fetch(`${baseUrl}/reports/${reportId}/images`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to upload report images');
  }

  const data = await response.json();
  return data.imageKeys;
}

export async function checkReportExists(
  authClient: { getCookie: () => string },
  baseUrl: string,
  bookingId: string,
): Promise<boolean> {
  const response = await apiFetch(authClient, baseUrl, `/reports/booking/${bookingId}/check`, 'GET');

  if (!response.ok) {
    throw new Error('Failed to check report status');
  }

  const data = await response.json();
  return data.exists;
}
