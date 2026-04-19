import { Button, Card, Input, ScreenContainer, Typography } from '@repo/components';
import { Check } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './AddEWallet.styles';
import { useAddEWallet } from './AddEWallet.hooks';

const WALLETS = [
  { id: 'GCASH', name: 'GCash', color: '#007DFE' },
  { id: 'MAYA', name: 'Maya', color: '#232526' },
];

export function AddEWalletScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { control, handleSubmit, setValue, errors, isSubmitting, selectedChannel, onSubmit } = useAddEWallet();

  return (
    <ScreenContainer keyboardAware edges={['top', 'left', 'right']} contentPadding="m">
      <View style={styles.heroCard}>
        <Typography variant="h3" color="textInverse">
          Link an e-wallet
        </Typography>
        <Typography variant="body2" color="textInverse">
          Pay faster by connecting your preferred wallet.
        </Typography>
      </View>

      <View style={styles.sectionCard}>
        <Typography variant="h5" style={styles.sectionTitle}>
          Select Wallet
        </Typography>

        <View style={styles.walletGrid}>
          {WALLETS.map(wallet => {
            const isSelected = selectedChannel === wallet.id;
            return (
              <Card
                key={wallet.id}
                onPress={() => setValue('channelCode', wallet.id)}
                style={[styles.walletTouch, styles.walletCard, isSelected && styles.walletCardSelected]}
                padding="m"
              >
                <View style={[styles.placeholderLogo, { backgroundColor: wallet.color }]}>
                  <Typography variant="caption" color="white" weight="bold">
                    {wallet.name[0]}
                  </Typography>
                </View>
                <Typography weight={isSelected ? 'bold' : 'regular'}>{wallet.name}</Typography>

                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color={colors.white} />
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Typography variant="h5" style={styles.sectionTitle}>
          Account Details
        </Typography>

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Phone Number"
              placeholder="0917 123 4567"
              keyboardType="phone-pad"
              maxLength={13}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.phoneNumber?.message}
              helperText="The number linked to your e-wallet account"
            />
          )}
        />
      </View>

      <Button title="Link Account" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
    </ScreenContainer>
  );
}
