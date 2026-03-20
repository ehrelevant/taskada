import { seekerClient } from '@lib/seekerClient';
import type { ServiceType } from '@repo/types';
import { useEffect, useState } from 'react';

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServiceTypes() {
      try {
        const types = await seekerClient.getServiceTypes();
        setServiceTypes(types);
      } catch {
        setError('Failed to load service types');
      } finally {
        setLoading(false);
      }
    }

    loadServiceTypes();
  }, []);

  return {
    serviceTypes,
    loading,
    error,
  };
}
