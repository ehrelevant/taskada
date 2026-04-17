import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { Check, ChevronDown, X } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import type { ProviderService } from '@repo/types';
import { spacing, useTheme } from '@repo/theme';
import { useEffect, useState } from 'react';

import { createStyles } from './AddServiceModal.styles';
import { useAddServiceModal } from './AddServiceModal.hooks';

type Props = {
  visible: boolean;
  serviceToEdit?: ProviderService | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddServiceModal({ visible, serviceToEdit, onClose, onSuccess }: Props) {
  const [showTypePicker, setShowTypePicker] = useState(false);
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

  useEffect(() => {
    if (!visible) {
      setShowTypePicker(false);
    }
  }, [visible]);

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
              render={({ field: { value } }) => (
                <View>
                  <TouchableOpacity
                    style={[
                      styles.typeSelectorButton,
                      showTypePicker && styles.typeSelectorButtonOpen,
                      isEditing && styles.typeSelectorButtonDisabled,
                    ]}
                    onPress={() => {
                      if (!isEditing) {
                        setShowTypePicker(true);
                      }
                    }}
                    disabled={isEditing}
                  >
                    <Typography
                      variant="body2"
                      color={value ? 'textPrimary' : 'textSecondary'}
                      style={styles.typeSelectorText}
                      numberOfLines={1}
                    >
                      {serviceTypes.find(type => type.id === value)?.name || 'Select service type'}
                    </Typography>
                    {!isEditing ? <ChevronDown size={18} color={colors.textSecondary} /> : null}
                  </TouchableOpacity>
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

      <Modal visible={showTypePicker && !isEditing} animationType="slide" onRequestClose={() => setShowTypePicker(false)}>
        <ScreenContainer style={styles.pickerContainer} contentPadding="m" contentStyle={styles.pickerContent}>
          <View style={styles.heroCard}>
            <View style={styles.pickerHeader}>
              <Typography variant="h3" color="textInverse">
                Select Service Type
              </Typography>
              <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                <X size={24} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          </View>

          <Controller
            control={control}
            name="serviceTypeId"
            render={({ field: { onChange, value } }) => (
              <FlatList
                data={serviceTypes}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const isSelected = value === item.id;

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onChange(item.id);
                        setShowTypePicker(false);
                      }}
                      style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
                      activeOpacity={0.8}
                    >
                      <Typography variant="body1" weight={isSelected ? 'semiBold' : 'regular'}>
                        {item.name}
                      </Typography>
                      {isSelected ? <Check size={16} color={colors.actionPrimary} /> : null}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <Typography variant="body2" color="textSecondary" style={styles.noResults}>
                    No service types available
                  </Typography>
                }
                contentContainerStyle={styles.pickerList}
              />
            )}
          />
        </ScreenContainer>
      </Modal>
    </Modal>
  );
}
