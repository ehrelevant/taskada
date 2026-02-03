import * as v from 'valibot';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Input, Typography } from '@repo/components';
import { colors, spacing } from '@repo/theme';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';

// Validation Schema
const cardSchema = v.object({
  cardHolderName: v.pipe(v.string(), v.minLength(1, 'Cardholder name is required')),
  cardNumber: v.pipe(v.string(), v.regex(/^\d{16}$/, 'Card number must be 16 digits')),
  expiryDate: v.pipe(v.string(), v.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY')),
  cvv: v.pipe(v.string(), v.regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')),
});

type CardFormData = v.InferOutput<typeof cardSchema>;

export function AddCardScreen() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: valibotResolver(cardSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = async (data: CardFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Tokenizing Card:', data);
      // TODO: Call Xendit SDK here to tokenize, then send token to backend

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Card added successfully');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to add card');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
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
                      // Auto-formatting for MM/YY
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
  },
  header: {
    marginBottom: spacing.l,
  },
  form: {
    gap: spacing.m,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
