import { BadgeCheck, CreditCard, Plus, Trash2, Wallet } from 'lucide-react-native';
import { Card, EmptyState, ScreenContainer, Typography } from '@repo/components';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { TouchableOpacity, View } from 'react-native';
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
    <ScreenContainer scrollable padding="none" verticalPadding="none">
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              saved methods
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse">
            Payment setup
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Manage cards and wallets for faster checkout.
          </Typography>
        </View>

        <Typography variant="h4" style={styles.sectionTitle}>
          Saved Methods
        </Typography>

        <View style={styles.savedMethodsContainer}>
          {SAVED_METHODS.length > 0 ? (
            SAVED_METHODS.map(method => (
              <Card key={method.id} elevation="xs" padding="m" style={styles.methodCard}>
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
            <EmptyState message="No payment methods added yet." />
          )}
        </View>

        <Typography variant="h4" style={styles.sectionTitle}>
          Add Payment Method
        </Typography>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
            <Card elevation="xs" padding="m" style={styles.actionCard}>
              <View style={[styles.actionIcon, styles.cardIconBg]}>
                <CreditCard color={colors.secondary.base} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">Credit / Debit Card</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Visa, Mastercard, JCB
                </Typography>
              </View>
              <Plus color={colors.actionSecondary} size={20} style={styles.plusIcon} />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AddEWallet')}>
            <Card elevation="xs" padding="m" style={styles.actionCard}>
              <View style={[styles.actionIcon, styles.walletIconBg]}>
                <Wallet color={colors.secondary.base} size={24} />
              </View>
              <View>
                <Typography variant="subtitle2">E-Wallet</Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  GCash, Maya
                </Typography>
              </View>
              <Plus color={colors.actionSecondary} size={20} style={styles.plusIcon} />
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
