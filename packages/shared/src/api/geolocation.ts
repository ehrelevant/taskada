export async function reverseGeocode(lat: number, lng: number, googleMapsApiKey: string): Promise<string> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`,
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].formatted_address || '';
  }
  return '';
}

export async function forwardGeocode(
  address: string,
  googleMapsApiKey: string,
): Promise<{ lat: number; lng: number } | null> {
  const encodedAddress = encodeURIComponent(address);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleMapsApiKey}`,
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
  return null;
}
