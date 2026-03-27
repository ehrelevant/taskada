import * as Location from 'expo-location';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface MapSectionProps {
  onLocationUpdate: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  forwardedCoords?: { lat: number; lng: number } | null;
}

export function useMapSection({ onLocationUpdate, initialLat, initialLng, forwardedCoords }: MapSectionProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [_address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const isAnimatingRef = useRef(false);

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

  const lastForwardedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!forwardedCoords) return;
    const key = `${forwardedCoords.lat},${forwardedCoords.lng}`;
    if (key === lastForwardedRef.current) return;
    lastForwardedRef.current = key;
    setLocation({ lat: forwardedCoords.lat, lng: forwardedCoords.lng });
    isAnimatingRef.current = true;
    mapRef.current?.animateToRegion(
      {
        latitude: forwardedCoords.lat,
        longitude: forwardedCoords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      300,
    );
  }, [forwardedCoords]);

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        return;
      }
      setLocation({ lat: region.latitude, lng: region.longitude });
      fetchAddress(region.latitude, region.longitude);
    },
    [fetchAddress],
  );

  return {
    location,
    loading,
    mapRef,
    handleRegionChangeComplete,
  };
}
