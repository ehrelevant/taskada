import * as v from 'valibot';
import { providerClient } from '@lib/providerClient';
import type { ProviderService, ServiceType } from '@repo/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';

const serviceSchema = v.object({
  serviceTypeId: v.pipe(v.string(), v.minLength(1, 'Please select a service type')),
  initialCost: v.pipe(
    v.string(),
    v.minLength(1, 'Price is required'),
    v.regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format (e.g. 100.00)'),
  ),
});

type ServiceFormData = v.InferOutput<typeof serviceSchema>;

type Props = {
  visible: boolean;
  serviceToEdit?: ProviderService | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function useAddServiceModal({ visible, serviceToEdit, onClose, onSuccess }: Props) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const isEditing = !!serviceToEdit;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: valibotResolver(serviceSchema),
    defaultValues: {
      serviceTypeId: '',
      initialCost: '',
    },
  });

  useEffect(() => {
    if (visible) {
      if (serviceToEdit) {
        setValue('serviceTypeId', serviceToEdit.serviceType.id);
        setValue('initialCost', String(serviceToEdit.initialCost));
      } else {
        reset({
          serviceTypeId: '',
          initialCost: '',
        });
      }

      if (serviceTypes.length === 0) {
        setIsLoadingTypes(true);
        providerClient
          .apiFetch('/service-types', 'GET')
          .then((res: Response) => res.json())
          .then((data: ServiceType[]) => setServiceTypes(data))
          .catch((err: unknown) => console.error('Failed to load types:', err))
          .finally(() => setIsLoadingTypes(false));
      }
    }
  }, [visible, serviceToEdit, setValue, reset, serviceTypes.length, setValue]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      let res;
      const payload = {
        serviceTypeId: data.serviceTypeId,
        initialCost: parseFloat(data.initialCost),
        ...(isEditing ? {} : { isEnabled: true }),
      };

      if (isEditing && serviceToEdit) {
        res = await providerClient.apiFetch(`/services/${serviceToEdit.id}`, 'PATCH', {
          body: JSON.stringify(payload),
        });
      } else {
        res = await providerClient.apiFetch('/services', 'POST', {
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        reset();
        onSuccess();
        onClose();
      } else {
        console.error('Failed to save service');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    serviceTypes,
    isLoadingTypes,
    isEditing,
    control,
    handleSubmit,
    reset,
    errors,
    isSubmitting,
    onSubmit,
    handleCancel,
  };
}
