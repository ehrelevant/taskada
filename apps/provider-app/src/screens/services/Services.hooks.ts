import { Alert } from 'react-native';
import { providerClient } from '@lib/providerClient';
import type { ProviderService } from '@repo/types';
import { useEffect, useState } from 'react';

export function useServicesScreen() {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProviderService | null>(null);

  const fetchServices = async () => {
    try {
      const res = await providerClient.apiFetch('/services/my-services', 'GET');
      if (res.ok) {
        setServices(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: ProviderService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (service: ProviderService) => {
    Alert.alert('Delete Service', `Are you sure you want to remove ${service.serviceType.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setServices(prev => prev.filter(s => s.id !== service.id));

          try {
            const res = await providerClient.apiFetch(`/services/${service.id}`, 'DELETE');
            if (!res.ok) throw new Error();
          } catch {
            Alert.alert('Error', 'Failed to delete service');
            fetchServices();
          }
        },
      },
    ]);
  };

  const toggleService = async (id: string, currentStatus: boolean) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, isEnabled: !currentStatus } : s)));

    try {
      const res = await providerClient.apiFetch(`/services/${id}`, 'PATCH', {
        body: JSON.stringify({ isEnabled: !currentStatus }),
      });
      if (!res.ok) throw new Error('API Error');
    } catch {
      setServices(prev => prev.map(s => (s.id === id ? { ...s, isEnabled: currentStatus } : s)));
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleOpenModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  return {
    services,
    isRefreshing,
    isModalOpen,
    editingService,
    fetchServices,
    handleEdit,
    handleDelete,
    toggleService,
    handleCloseModal,
    handleOpenModal,
  };
}
