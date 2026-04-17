import { ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { Controller } from 'react-hook-form';
import type { ProviderService } from '@repo/types';
import { spacing, useTheme } from '@repo/theme';

import { createStyles } from './AddServiceModal.styles';
import { useAddServiceModal } from './AddServiceModal.hooks';

type Props = {
  visible: boolean;
  serviceToEdit?: ProviderService | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddServiceModal({ visible, serviceToEdit, onClose, onSuccess }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
      <ScreenContainer keyboardAware contentStyle={styles.overlayContent}>
        <View style={styles.heroCard}>
          <Typography variant="h3" color="textInverse" style={styles.title}>
            {isEditing ? 'Edit Service' : 'Add Service'}
          </Typography>
          <Typography variant="body2" color="textInverse">
            {isEditing ? 'Update your pricing and details.' : 'Add a new service offering to your profile.'}
          </Typography>
        </View>

        <View style={styles.fieldContainer}>
          <Typography variant="subtitle2">Select Service Type</Typography>
          <Typography variant="caption" color={colors.textSecondary}>
            {isEditing ? 'Service type cannot be changed while editing.' : 'Choose the service you offer.'}
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
            <Typography variant="caption" color={colors.error.base} style={{ marginTop: spacing.xs }}>
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

        <View style={styles.actions}>
          <Button title="Cancel" variant="outline" onPress={handleCancel} style={styles.button} />
          <Button
            title={isEditing ? 'Save Changes' : 'Add Service'}
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            style={styles.button}
          />
        </View>
      </ScreenContainer>
    </Modal>
  );
}
