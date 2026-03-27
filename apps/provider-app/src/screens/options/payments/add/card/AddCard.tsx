import { BadgeCheck } from 'lucide-react-native';
import { Button, Input, Typography } from '@repo/components';
import { Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '@repo/theme';
import { View } from 'react-native';

import { createStyles } from './AddCard.styles';
import { useAddCardScreen } from './AddCard.hooks';

export function AddCardScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { control, handleSubmit, errors, isSubmitting, onSubmit } = useAddCardScreen();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              secure payout setup
            </Typography>
          </View>
          <Typography variant="h3" color="textInverse">
            Add a card
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.heroSubtitle}>
            Cards are used to receive payout transfers from completed services.
          </Typography>
        </View>

        <View style={styles.header}>
          <Typography variant="body2" color={colors.textSecondary}>
            We verify your card with a temporary charge that is immediately refunded.
          </Typography>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Card Number"
                placeholder="0000 0000 0000 0000"
                keyboardType="numeric"
                maxLength={16}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.cardNumber?.message}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="expiryDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Expiry (MM/YY)"
                    placeholder="MM/YY"
                    maxLength={5}
                    onBlur={onBlur}
                    onChangeText={text => {
                      if (text.length === 2 && value.length === 1) {
                        onChange(text + '/');
                      } else {
                        onChange(text);
                      }
                    }}
                    value={value}
                    error={errors.expiryDate?.message}
                  />
                )}
              />
            </View>
            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="CVV"
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.cvv?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="cardHolderName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Cardholder Name"
                placeholder="Name on Card"
                autoCapitalize="characters"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.cardHolderName?.message}
              />
            )}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Button title="Add Card" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
      </View>
    </View>
  );
}
