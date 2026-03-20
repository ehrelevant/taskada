import * as v from 'valibot';
import { Alert } from 'react-native';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { valibotResolver } from '@hookform/resolvers/valibot';

const eWalletSchema = v.object({
  channelCode: v.string('Please select a wallet'),
  phoneNumber: v.pipe(v.string(), v.regex(/^(09|\+639)\d{9}$/, 'Invalid PH phone number (e.g., 0917...)')),
});

export type EWalletFormData = v.InferOutput<typeof eWalletSchema>;

export function useAddEWallet() {
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

  const onSubmit = useCallback(
    async (data: EWalletFormData) => {
      setIsSubmitting(true);
      try {
        console.log('Linking Wallet:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Redirecting', 'You would now be redirected to the e-wallet app to authorize.');
        navigation.goBack();
      } catch {
        Alert.alert('Error', 'Failed to link account');
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigation],
  );

  return {
    control,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    selectedChannel,
    onSubmit,
  };
}
