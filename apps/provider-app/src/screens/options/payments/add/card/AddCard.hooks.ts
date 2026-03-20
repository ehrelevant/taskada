import * as v from 'valibot';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { valibotResolver } from '@hookform/resolvers/valibot';

const cardSchema = v.object({
  cardHolderName: v.pipe(v.string(), v.minLength(1, 'Cardholder name is required')),
  cardNumber: v.pipe(v.string(), v.regex(/^\d{16}$/, 'Card number must be 16 digits')),
  expiryDate: v.pipe(v.string(), v.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY')),
  cvv: v.pipe(v.string(), v.regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')),
});

type CardFormData = v.InferOutput<typeof cardSchema>;

export function useAddCardScreen() {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.goBack();
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
