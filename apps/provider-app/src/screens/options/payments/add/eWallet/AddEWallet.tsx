import { BadgeCheck, Check } from 'lucide-react-native';
import { Button, Card, Input, Typography } from '@repo/components';
import { Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

import { createStyles } from './AddEWallet.styles';
import { useAddEWalletScreen } from './AddEWallet.hooks';

export function AddEWalletScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { wallets, selectedChannel, setValue, control, handleSubmit, errors, isSubmitting, onSubmit } =
    useAddEWalletScreen();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              fast payout channel
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse">
            Link an e-wallet
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Use your wallet number to receive earnings quickly.
          </Typography>
        </View>

        <View style={styles.sectionCard}>
          <Typography variant="h5" style={styles.sectionTitle}>
            Select Wallet
          </Typography>

          <View style={styles.walletGrid}>
            {wallets.map(wallet => {
              const isSelected = selectedChannel === wallet.id;
              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => setValue('channelCode', wallet.id)}
                  activeOpacity={0.9}
                  style={styles.walletTouch}
                >
                  <Card style={[styles.walletCard, isSelected && styles.walletCardSelected]} padding="m">
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
                </TouchableOpacity>
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
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Button title="Link Account" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
      </View>
    </View>
  );
}
