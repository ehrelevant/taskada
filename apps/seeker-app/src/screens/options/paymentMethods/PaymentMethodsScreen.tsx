import { Card, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { CreditCard, Plus, Trash2, Wallet } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type NavProp = NativeStackNavigationProp<OptionsStackParamList, 'PaymentMethods'>;

// Mock Data
// TODO: Replace with real data fetching with onEffect
const SAVED_METHODS = [
  { id: '1', type: 'CARD', label: 'Visa ending in 4242', icon: 'visa' },
  { id: '2', type: 'EWALLET', label: 'GCash (0917 *** 8888)', icon: 'gcash' },
];

export function PaymentMethodsScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saved Payment Methods List */}
        <Typography variant="h5" style={styles.sectionTitle}>Saved Methods</Typography>

        <View style={styles.savedMethodsContainer}>
          {SAVED_METHODS.length > 0 ? (
            SAVED_METHODS.map((method) => (
              <Card key={method.id} style={styles.methodCard} padding="m">
                <View style={styles.methodInfo}>
                  <View style={styles.iconContainer}>
                    {method.type === 'CARD' ? (
                      <CreditCard color={colors.textPrimary} size={24} />
                    ) : (
                      <Wallet color={colors.textPrimary} size={24} />
                    )}
                  </View>
                  <Typography variant="body1" weight="medium">
                    {method.label}
                  </Typography>
                </View>
                <TouchableOpacity>
                  <Trash2 color={colors.error} size={20} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Typography color={colors.textSecondary}>No payment methods added yet.</Typography>
            </View>
          )}
        </View>

        {/* Add New Payment Method */}
        <Typography variant="h5" style={styles.sectionTitle}>Add Payment Method</Typography>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddCard')}
          >
            <Card style={styles.actionCard} padding="m">
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <CreditCard color={colors.actionPrimary} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">Credit / Debit Card</Typography>
                <Typography variant="caption" color={colors.textSecondary}>Visa, Mastercard, JCB</Typography>
              </View>
              <Plus color={colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AddEWallet')}
          >
            <Card style={styles.actionCard} padding="m">
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Wallet color={colors.success} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">E-Wallet</Typography>
                <Typography variant="caption" color={colors.textSecondary}>GCash, Maya</Typography>
              </View>
               <Plus color={colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
            </Card>
          </TouchableOpacity>
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
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
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