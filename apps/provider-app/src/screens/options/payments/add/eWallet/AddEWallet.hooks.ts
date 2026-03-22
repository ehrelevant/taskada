import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type NavProp = NativeStackNavigationProp<OptionsStackParamList, 'AddEWallet'>;

const WALLETS = [
  { id: 'GCASH', name: 'GCash', color: '#007DFE' },
  { id: 'MAYA', name: 'Maya', color: '#232526' },
];

const eWalletSchema = z.object({
  channelCode: z.string({ error: issue => (issue.input === undefined ? 'Please select a wallet' : 'Invalid wallet') }),
  phoneNumber: z.string().regex(/^(09|\+639)\d{9}$/, 'Invalid PH phone number (e.g., 0917...)'),
});

type EWalletFormData = z.infer<typeof eWalletSchema>;

export function useAddEWalletScreen() {
  const navigation = useNavigation<NavProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EWalletFormData>({
    resolver: zodResolver(eWalletSchema),
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.goBack();
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    wallets: WALLETS,
    selectedChannel,
    setValue,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
