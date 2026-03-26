import { Alert, View } from 'react-native';
import { Button, Input, ScreenContainer, Typography } from '@repo/components';
import { Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@repo/theme';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createStyles } from './AddCard.styles';

const cardSchema = z.object({
  cardHolderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CardFormData = z.infer<typeof cardSchema>;

export function AddCardScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = useCallback(
    async (_data: CardFormData) => {
      setIsSubmitting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Success', 'Card added successfully');
        navigation.goBack();
      } catch {
        Alert.alert('Error', 'Failed to add card');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigation],
  );

  return (
    <ScreenContainer
      padding="none"
      stickyFooter={<Button title="Add Card" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="body2" color="textSecondary">
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
    </ScreenContainer>
  );
}
