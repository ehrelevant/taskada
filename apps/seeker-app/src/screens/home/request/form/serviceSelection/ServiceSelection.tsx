import { Avatar, Typography } from '@repo/components';
import { Controller, useFormContext } from 'react-hook-form';
import { Search, Sparkles, X } from 'lucide-react-native';
import type { SearchResult } from '@repo/types';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './ServiceSelection.styles';

interface ServiceSelectionProps {
  onOpenSearch: () => void;
  selectedService: SearchResult | null;
  onClearSelection: () => void;
  searchDisabled?: boolean;
  emptyHint?: string;
}

export function ServiceSelection({
  onOpenSearch,
  selectedService,
  onClearSelection,
  searchDisabled = false,
  emptyHint,
}: ServiceSelectionProps) {
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
        render={({ field: { value } }) => {
          const resolvedSelectedService =
            value && selectedService && selectedService.serviceId === value ? selectedService : null;
          const hasResolvedSelection = Boolean(resolvedSelectedService);

          return (
            <>
              <Typography variant="body2" weight="medium" style={styles.label}>
                Service Selection
              </Typography>

              {!hasResolvedSelection ? (
                <TouchableOpacity
                  style={[styles.searchButton, searchDisabled && styles.searchButtonDisabled]}
                  onPress={onOpenSearch}
                  disabled={searchDisabled}
                >
                  <Search size={20} color={searchDisabled ? colors.textSecondary : colors.actionPrimary} />
                  <Typography
                    variant="body1"
                    color={searchDisabled ? 'textSecondary' : 'actionPrimary'}
                    style={styles.searchButtonText}
                  >
                    Choose a Service
                  </Typography>
                </TouchableOpacity>
              ) : (
                <View style={styles.serviceCard}>
                  <View style={styles.serviceTopRow}>
                    <Typography variant="overline" color={colors.home.chipText}>
                      {resolvedSelectedService!.serviceTypeName}
                    </Typography>
                    <TouchableOpacity style={styles.clearButton} onPress={onClearSelection}>
                      <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.serviceInfo}>
                    <View style={styles.providerRow}>
                      <Avatar
                        source={
                          resolvedSelectedService!.providerAvatar
                            ? { uri: resolvedSelectedService!.providerAvatar }
                            : null
                        }
                        size={28}
                        name={resolvedSelectedService!.providerName}
                      />
                      <Typography variant="body1" weight="medium" style={styles.providerName}>
                        {resolvedSelectedService!.providerName}
                      </Typography>
                    </View>
                    <Typography variant="body2" color="actionPrimary" style={styles.priceText}>
                      {formatCurrency(resolvedSelectedService!.initialCost)}
                    </Typography>
                  </View>
                </View>
              )}

              {!hasResolvedSelection && (
                <View style={styles.autoMatchHint}>
                  <Sparkles size={14} color={colors.textSecondary} />
                  <Typography variant="caption" color="textSecondary">
                    {emptyHint || 'Leave empty to be matched with the best available provider'}
                  </Typography>
                </View>
              )}
            </>
          );
        }}
      />
    </View>
  );
}
