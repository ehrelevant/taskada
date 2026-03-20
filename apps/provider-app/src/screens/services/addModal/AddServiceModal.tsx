import { ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import { Button, Input, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import type { ProviderService } from '@repo/types';

import { styles } from './AddServiceModal.styles';
import { useAddServiceModal } from './AddServiceModal.hooks';

type Props = {
  visible: boolean;
  serviceToEdit?: ProviderService | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddServiceModal({ visible, serviceToEdit, onClose, onSuccess }: Props) {
  const {
    serviceTypes,
    isLoadingTypes,
    isEditing,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    handleCancel,
  } = useAddServiceModal({ visible, serviceToEdit, onClose, onSuccess });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Typography variant="h4" style={styles.title}>
            {isEditing ? 'Edit Service' : 'New Service'}
          </Typography>

          <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
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
                      {serviceTypes.map(type => {
                        const isSelected = value === type.id;
                        const isDisabled = isEditing && !isSelected;

                        return (
                          <TouchableOpacity
                            key={type.id}
                            onPress={() => !isDisabled && onChange(type.id)}
                            style={[styles.chip, isSelected && styles.chipSelected, isDisabled && styles.chipDisabled]}
                            disabled={isDisabled}
                          >
                            <Typography
                              variant="caption"
                              color={isSelected ? colors.white : isDisabled ? colors.textDisabled : colors.textPrimary}
                            >
                              {type.name}
                            </Typography>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                />
              )}
              {errors.serviceTypeId && (
                <Typography variant="caption" color={colors.error.base} style={{ marginTop: 4 }}>
                  {errors.serviceTypeId.message}
                </Typography>
              )}
            </View>

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
            <Button title="Cancel" variant="text" onPress={handleCancel} style={styles.button} />
            <Button
              title={isEditing ? 'Save Changes' : 'Add Service'}
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
