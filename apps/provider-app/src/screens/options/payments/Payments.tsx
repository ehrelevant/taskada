import { BadgeCheck, CreditCard, Plus, Trash2, Wallet } from 'lucide-react-native';
import { Card, Typography } from '@repo/components';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './Payments.styles';
import { usePayments } from './Payments.hooks';

export function PaymentsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { savedMethods, navigation } = usePayments();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              payment methods
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse">
            Payout setup
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Add and manage where your earnings are sent.
          </Typography>
        </View>

        <Typography variant="h5" style={styles.sectionTitle}>
          Saved Methods
        </Typography>

        <View style={styles.savedMethodsContainer}>
          {savedMethods.length > 0 ? (
            savedMethods.map(method => (
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
