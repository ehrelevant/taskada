import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { CreditCard, Plus, Trash2 } from 'lucide-react-native';
import { PaymentMethod } from '@repo/database';

import { Props, SavedMethod } from './types';

import BPI from './assets/BPI/logo.svg';
import GCASH from './assets/GCash/logo.svg';
import GRAB from './assets/Grab/logo.jpeg';
import MAYA from './assets/Maya/logo.svg';
import RCBC from './assets/RCBC/logo.svg';
import UBP from './assets/UBP/logo.svg';

export function PaymentMethodsScreen({ apiFetch, navigation }: Props) {
  const [methods, setMethods] = useState<SavedMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await apiFetch('/payment-method', 'GET');
        if (!res.ok) throw new Error('Failed to load payment methods');
        const data: PaymentMethod[] = await res.json();

        const mapped: SavedMethod[] = data.map(pm => {
          const type = pm.type;
          const channel = pm.channelCode;

          // Determine icon
          let icon = undefined;
          let label = channel;
          const ch = channel.toLowerCase();
          if (ch.includes('gcash')) {
            icon = <GCASH width={28} height={28} />;
            label = 'GCASH';
          } else if (ch.includes('bpi')) {
            icon = <BPI width={28} height={28} />;
          } else if (ch.includes('grab')) {
            icon = <Image source={GRAB} style={styles.logoImage} />;
          } else if (ch.includes('maya')) {
            icon = <MAYA width={28} height={28} />;
            label = (pm.metadata as Record<string, string>).account_number;
          } else if (ch.includes('rcbc')) {
            icon = <RCBC width={28} height={28} />;
          } else if (ch.includes('ubp') || ch.includes('unionbank')) {
            icon = <UBP width={28} height={28} />;
          }

          // if (metadata?.card?.last4) label = `Card ending in ${metadata.card.last4}`;
          // else if (metadata?.phone) label = `${channel} (${metadata.phone})`;

          return { id: pm.id, type, icon, label };
        });

        if (mounted) setMethods(mapped);
      } catch (err) {
        console.error('Load payment methods', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(id: string) {
    try {
      const res = await apiFetch(`/payment-method/${id}`, 'DELETE');
      if (!res.ok) throw new Error('Failed to delete payment method');
      setMethods(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Delete payment method', err);
      Alert.alert('Error', 'Failed to delete payment method');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saved Payment Methods List */}
        <Typography variant="h5" style={styles.sectionTitle}>
          Saved Methods
        </Typography>

        <View style={styles.savedMethodsContainer}>
          {!loading && methods.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography color={colors.textSecondary}>No payment methods added yet.</Typography>
            </View>
          ) : (
            methods.map(method => {
              return (
                <Card key={method.id} style={styles.methodCard} padding="m">
                  <View style={styles.methodInfo}>
                    <View style={styles.iconContainer}>
                      {method.icon ?? <CreditCard color={colors.textPrimary} size={24} />}
                    </View>
                    <Typography variant="body1" weight="medium">
                      {method.label}
                    </Typography>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Delete payment method', 'Are you sure you want to remove this payment method?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(method.id) },
                      ])
                    }
                  >
                    <Trash2 color={colors.error.base} size={20} />
                  </TouchableOpacity>
                </Card>
              );
            })
          )}
        </View>

        {/* Add New Payment Method */}
        <Typography variant="h5" style={styles.sectionTitle}>
          Add Payment Method
        </Typography>

        <View style={styles.actionsContainer}>
          <Card style={styles.actionCard} padding="m" onPress={() => navigation.navigate('PaymentMethodLinking')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <CreditCard color={colors.actionPrimary} size={24} />
            </View>
            <View>
              <Typography variant="subtitle2">Add new Payment Method</Typography>
            </View>
            <Plus color={colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    padding: spacing.m,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    marginTop: spacing.s,
    marginLeft: spacing.xs,
  },
  savedMethodsContainer: {
    gap: spacing.s,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  emptyState: {
    padding: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.m,
    marginBottom: spacing.l,
  },
  actionsContainer: {
    gap: spacing.s,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
