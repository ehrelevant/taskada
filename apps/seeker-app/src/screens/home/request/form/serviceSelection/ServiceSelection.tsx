import { Avatar, Typography } from '@repo/components';
import { Controller, useFormContext } from 'react-hook-form';
import { Image, TouchableOpacity, View } from 'react-native';
import { Search, Sparkles, X } from 'lucide-react-native';
import type { SearchResult } from '@repo/types';
import { useTheme } from '@repo/theme';

import { createStyles } from './ServiceSelection.styles';

interface ServiceSelectionProps {
  onOpenSearch: () => void;
  selectedService: SearchResult | null;
  onClearSelection: () => void;
}

export function ServiceSelection({ onOpenSearch, selectedService, onClearSelection }: ServiceSelectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { control } = useFormContext();

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `PHP ${amount.toLocaleString()}`;
    }
  };

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
                <View style={styles.serviceTopRow}>
                  <Typography variant="overline" color={colors.home.chipText}>
                    {selectedService.serviceTypeName}
                  </Typography>
                  <TouchableOpacity style={styles.clearButton} onPress={onClearSelection}>
                    <X size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

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
                  <Typography variant="body2" color="actionPrimary" style={styles.priceText}>
                    {formatCurrency(selectedService.initialCost)}
                  </Typography>
                </View>
              </View>
            ) : null}

            {!value && (
              <View style={styles.autoMatchHint}>
                <Sparkles size={14} color={colors.textSecondary} />
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
