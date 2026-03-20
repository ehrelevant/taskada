import * as Location from 'expo-location';
import type { MarkerDragStartEndEvent } from 'react-native-maps';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';

export interface MapSectionProps {
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export function useMapSection({ onLocationUpdate, initialLat, initialLng }: MapSectionProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [_address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      const addr = await seekerClient.reverseGeocode(lat, lng);
      setAddress(addr);
      onLocationUpdate(lat, lng, addr);
    },
    [onLocationUpdate],
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoading(false);
          return;
        }

        if (initialLat !== undefined && initialLng !== undefined) {
          setLocation({ lat: initialLat, lng: initialLng });
          fetchAddress(initialLat, initialLng);
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        const { latitude, longitude } = currentLocation.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude);
      } catch (error) {
        console.error('Failed to get location:', error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, [initialLat, initialLng, fetchAddress]);

  const handleMarkerDragEnd = useCallback(
    async (e: MarkerDragStartEndEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setLocation({ lat: latitude, lng: longitude });
      await fetchAddress(latitude, longitude);
    },
    [fetchAddress],
  );

  return {
    location,
    loading,
    handleMarkerDragEnd,
  };
}
