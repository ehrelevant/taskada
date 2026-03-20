import { Card, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { CreditCard, Plus, Trash2, Wallet } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { styles } from './Payments.styles';
import { usePayments } from './Payments.hooks';

export function PaymentsScreen() {
  const { savedMethods, navigation } = usePayments();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
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
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
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
