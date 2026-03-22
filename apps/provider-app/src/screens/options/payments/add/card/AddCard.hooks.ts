import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const cardSchema = z.object({
  cardHolderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format must be MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CardFormData = z.infer<typeof cardSchema>;

export function useAddCardScreen() {
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

  const onSubmit = async (_data: CardFormData) => {
    setIsSubmitting(true);
    try {
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
