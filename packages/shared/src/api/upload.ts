export async function uploadAvatar(
  authClient: { getCookie: () => string },
  baseUrl: string,
  uri: string,
): Promise<{ avatarUrl: string }> {
  const cookies = authClient.getCookie();

  const formData = new FormData();
  const filename = uri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri,
    name: filename,
    type,
  } as unknown as Blob);

  const response = await fetch(`${baseUrl}/users/avatar`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload avatar');
  }

  return response.json();
}

export async function uploadMessageImages(
  authClient: { getCookie: () => string },
  baseUrl: string,
  bookingId: string,
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

  const response = await fetch(`${baseUrl}/bookings/${bookingId}/messages/images`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Failed to upload images');
  }

  const data = await response.json();
  return data.imageKeys;
}

export async function uploadRequestImages(
  authClient: { getCookie: () => string },
  baseUrl: string,
  requestId: string,
  imageUris: string[],
): Promise<void> {
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

  const response = await fetch(`${baseUrl}/requests/${requestId}/images`, {
    method: 'POST',
    headers: {
      Cookie: cookies,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload images');
  }
}

export async function deleteAvatar(authClient: { getCookie: () => string }, baseUrl: string): Promise<void> {
  const cookies = authClient.getCookie();

  const response = await fetch(`${baseUrl}/users/avatar`, {
    method: 'DELETE',
    headers: {
      Cookie: cookies,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete avatar');
  }
}
