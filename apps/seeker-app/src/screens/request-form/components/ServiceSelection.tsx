import { Avatar, Typography } from '@repo/components';
import { colors, radius, spacing } from '@repo/theme';
import { Controller, useFormContext } from 'react-hook-form';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import type { SearchResult } from '@lib/helpers';

interface ServiceSelectionProps {
  onOpenSearch: () => void;
  selectedService: SearchResult | null;
  onClearSelection: () => void;
}

export function ServiceSelection({ onOpenSearch, selectedService, onClearSelection }: ServiceSelectionProps) {
  const { control } = useFormContext();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="serviceId"
        render={({ field: { value } }) => (
          <>
            <Typography variant="body2" weight="medium" style={styles.label}>
              Service Selection
            </Typography>

            {!value ? (
              <TouchableOpacity style={styles.searchButton} onPress={onOpenSearch}>
                <Search size={20} color={colors.actionPrimary} />
                <Typography variant="body1" color="actionPrimary" style={styles.searchButtonText}>
                  Choose a Service
                </Typography>
              </TouchableOpacity>
            ) : selectedService ? (
              <View style={styles.serviceCard}>
                <View style={styles.serviceImageContainer}>
                  {selectedService.providerAvatar ? (
                    <Image
                      source={{ uri: selectedService.providerAvatar }}
                      style={styles.serviceImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.serviceImage, { backgroundColor: colors.backgroundSecondary }]} />
                  )}
                </View>

                <View style={styles.serviceInfo}>
                  <Typography variant="overline" color="textSecondary">
                    {selectedService.serviceTypeName}
                  </Typography>
                  <View style={styles.providerRow}>
                    <Avatar
                      source={selectedService.providerAvatar ? { uri: selectedService.providerAvatar } : null}
                      size={28}
                      name={selectedService.providerName}
                    />
                    <Typography variant="body1" weight="medium" style={styles.providerName}>
                      {selectedService.providerName}
                    </Typography>
                  </View>
                  <Typography variant="body2" color="textSecondary">
                    ${selectedService.initialCost.toFixed(2)}
                  </Typography>
                </View>

                <TouchableOpacity style={styles.clearButton} onPress={onClearSelection}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ) : null}

            {!value && (
              <View style={styles.autoMatchHint}>
                <Typography variant="caption" color="textSecondary">
                  Leave empty to be matched with the best available provider
                </Typography>
              </View>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  label: {
    marginBottom: spacing.s,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.actionPrimary,
    borderStyle: 'dashed',
    backgroundColor: colors.backgroundSecondary,
  },
  searchButtonText: {
    marginLeft: spacing.s,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
    borderRadius: radius.m,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.s,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: spacing.s,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  providerName: {
    marginLeft: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  autoMatchHint: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.s,
  },
});
