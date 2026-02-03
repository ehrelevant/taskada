import { GOOGLE_MAPS_API_KEY } from '../env';

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    if (!response.ok) {
      return '';
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address || '';
    }

    return '';
  } catch {
    return '';
  }
}

export async function forwardGeocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }

    return null;
  } catch {
    return null;
  }
}
