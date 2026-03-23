import { Card, Typography } from '@repo/components';
import { CreditCard, Plus, Trash2, Wallet } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@repo/theme';

import { createStyles } from './Payments.styles';

const SAVED_METHODS = [
  { id: '1', type: 'CARD', label: 'Visa ending in 4242', icon: 'visa' },
  { id: '2', type: 'EWALLET', label: 'GCash (0917 *** 8888)', icon: 'gcash' },
];

export function PaymentMethodsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<OptionsStackParamList>>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="h5" style={styles.sectionTitle}>
          Saved Methods
        </Typography>

        <View style={styles.savedMethodsContainer}>
          {SAVED_METHODS.length > 0 ? (
            SAVED_METHODS.map(method => (
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
                  <Trash2 color={colors.error.base} size={20} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Typography color={colors.textSecondary}>No payment methods added yet.</Typography>
            </View>
          )}
        </View>

        <Typography variant="h5" style={styles.sectionTitle}>
          Add Payment Method
        </Typography>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
            <Card style={styles.actionCard} padding="m">
              <View style={[styles.actionIcon, { backgroundColor: colors.info.light }]}>
                <CreditCard color={colors.actionPrimary} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">Credit / Debit Card</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Visa, Mastercard, JCB
                </Typography>
              </View>
              <Plus color={colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AddEWallet')}>
            <Card style={styles.actionCard} padding="m">
              <View style={[styles.actionIcon, { backgroundColor: colors.success.light }]}>
                <Wallet color={colors.success.base} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">E-Wallet</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  GCash, Maya
                </Typography>
              </View>
              <Plus color={colors.textSecondary} size={20} style={{ marginLeft: 'auto' }} />
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
