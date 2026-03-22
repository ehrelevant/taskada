import { HomeStackParamList } from '@navigation/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { seekerClient } from '@lib/seekerClient';
import type { ServiceType } from '@repo/types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useServiceTypes() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
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

  const handleServiceTypePress = useCallback(
    (serviceTypeId: string) => {
      navigation.navigate('RequestForm', { serviceTypeId });
    },
    [navigation],
  );

  return {
    serviceTypes,
    loading,
    error,
    handleServiceTypePress,
  };
}
