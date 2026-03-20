import { Button, Card, Input, Typography } from '@repo/components';
import { Check } from 'lucide-react-native';
import { colors } from '@repo/theme';
import { Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './AddEWallet.styles';
import { useAddEWallet } from './AddEWallet.hooks';

const WALLETS = [
  { id: 'GCASH', name: 'GCash', color: '#007DFE' },
  { id: 'MAYA', name: 'Maya', color: '#232526' },
];

export function AddEWalletScreen() {
  const { control, handleSubmit, setValue, errors, isSubmitting, selectedChannel, onSubmit } = useAddEWallet();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="h5" style={styles.sectionTitle}>
          Select Wallet
        </Typography>

        <View style={styles.walletGrid}>
          {WALLETS.map(wallet => {
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
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Button title="Link Account" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
      </View>
    </View>
  );
}
