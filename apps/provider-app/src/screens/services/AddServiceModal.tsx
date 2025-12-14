import * as v from 'valibot';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { apiFetch } from '@lib/helpers';
import { Button, Input, Typography } from '@repo/components';
import { colors, radius, spacing } from '@repo/theme';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useEffect, useState } from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';

const addServiceSchema = v.object({
  serviceTypeId: v.pipe(v.string(), v.minLength(1, 'Please select a service type')),
  initialCost: v.pipe(
    v.string(),
    v.minLength(1, 'Price is required'),
    v.regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format (e.g. 100.00)'),
  ),
});

type AddServiceFormData = v.InferOutput<typeof addServiceSchema>;

type ServiceType = {
  id: string;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddServiceModal({ visible, onClose, onSuccess }: Props) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddServiceFormData>({
    resolver: valibotResolver(addServiceSchema),
    defaultValues: {
      serviceTypeId: '',
      initialCost: '',
    },
  });

  // Fetch available service types when modal opens
  useEffect(() => {
    if (visible) {
      setIsLoadingTypes(true);
      apiFetch('/service-types', 'GET')
        .then((res) => res.json())
        .then((data) => setServiceTypes(data))
        .catch((err) => console.error('Failed to load types:', err))
        .finally(() => setIsLoadingTypes(false));
    }
  }, [visible]);

  const onSubmit = async (data: AddServiceFormData) => {
    try {
      console.log(data);
      const res = await apiFetch('/services', 'POST', {
        body: JSON.stringify({
          serviceTypeId: data.serviceTypeId,
          initialCost: parseFloat(data.initialCost),
          isEnabled: true,
        }),
      });
      console.log(res.status, await res.json());

      if (res.ok) {
        reset();
        onSuccess();
        onClose();
      } else {
        console.error('Failed to create service');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Typography variant="h4" style={styles.title}>
            New Service
          </Typography>

          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
            {/* Service Type Selector */}
            <View style={styles.fieldContainer}>
              <Typography variant="subtitle2" style={styles.label}>
                Select Service Type
              </Typography>

              {isLoadingTypes ? (
                <ActivityIndicator size="small" color={colors.actionPrimary} />
              ) : (
                <Controller
                  control={control}
                  name="serviceTypeId"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.typeList}>
                      {serviceTypes.map((type) => (
                        <TouchableOpacity
                          key={type.id}
                          onPress={() => onChange(type.id)}
                          style={[
                            styles.chip,
                            value === type.id && styles.chipSelected,
                          ]}
                        >
                          <Typography
                            variant="caption"
                            color={value === type.id ? colors.white : colors.textPrimary}
                          >
                            {type.name}
                          </Typography>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
              )}
              {errors.serviceTypeId && (
                <Typography variant="caption" color={colors.error} style={{ marginTop: 4 }}>
                  {errors.serviceTypeId.message}
                </Typography>
              )}
            </View>

            {/* Price Input */}
            <View style={styles.fieldContainer}>
              <Controller
                control={control}
                name="initialCost"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Base Price (Php)"
                    placeholder="0.00"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.initialCost?.message}
                  />
                )}
              />
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="text"
              onPress={() => {
                reset();
                onClose();
              }}
              style={styles.button}
            />
            <Button
              title="Add Service"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.l,
    maxHeight: '85%',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  scrollContent: {
    paddingBottom: spacing.m,
  },
  fieldContainer: {
    marginBottom: spacing.m,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  typeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: 8,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipSelected: {
    backgroundColor: colors.actionPrimary,
    borderColor: colors.actionPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.m,
    paddingTop: spacing.m,
  },
  button: {
    flex: 1,
  },
});