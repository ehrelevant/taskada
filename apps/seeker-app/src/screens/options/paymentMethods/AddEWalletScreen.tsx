import * as v from 'valibot';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Input, Typography } from '@repo/components';
import { Check } from 'lucide-react-native';
import { colors, spacing } from '@repo/theme';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';

const WALLETS = [
  { id: 'GCASH', name: 'GCash', color: '#007DFE' },
  { id: 'MAYA', name: 'Maya', color: '#232526' },
];

const eWalletSchema = v.object({
  channelCode: v.string('Please select a wallet'),
  phoneNumber: v.pipe(
    v.string(),
    v.regex(/^(09|\+639)\d{9}$/, 'Invalid PH phone number (e.g., 0917...)')
  ),
});

type EWalletFormData = v.InferOutput<typeof eWalletSchema>;

export function AddEWalletScreen() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EWalletFormData>({
    resolver: valibotResolver(eWalletSchema),
    defaultValues: {
      channelCode: 'GCASH',
      phoneNumber: '',
    },
  });

  const selectedChannel = watch('channelCode');

  const onSubmit = async (data: EWalletFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Linking Wallet:', data);
      // TODO: Backend call to initiate Account Linking

      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Redirecting', 'You would now be redirected to the e-wallet app to authorize.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to link account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <Typography variant="h5" style={styles.sectionTitle}>Select Wallet</Typography>

        <View style={styles.walletGrid}>
          {WALLETS.map((wallet) => {
            const isSelected = selectedChannel === wallet.id;
            return (
              <TouchableOpacity
                key={wallet.id}
                onPress={() => setValue('channelCode', wallet.id)}
                activeOpacity={0.9}
                style={styles.walletTouch}
              >
                <Card
                  style={[styles.walletCard, isSelected && styles.walletCardSelected]}
                  padding="m"
                >
                   {/* In a real app, use proper SVGs or Images for logos */}
                   <View style={[styles.placeholderLogo, { backgroundColor: wallet.color }]}>
                     <Typography variant="caption" color="white" weight="bold">{wallet.name[0]}</Typography>
                   </View>
                   <Typography weight={isSelected ? "bold" : "regular"}>{wallet.name}</Typography>

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

        <Typography variant="h5" style={styles.sectionTitle}>Account Details</Typography>

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
        <Button
          title="Link Account"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    marginTop: spacing.s,
  },
  walletGrid: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  walletTouch: {
    flex: 1,
  },
  walletCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.s,
    height: 100,
  },
  walletCardSelected: {
    borderColor: colors.actionPrimary,
    backgroundColor: colors.surfaceSecondary,
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.actionPrimary,
    borderRadius: 10,
    padding: 2,
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});