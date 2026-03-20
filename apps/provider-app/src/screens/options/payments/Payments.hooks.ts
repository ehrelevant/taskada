import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { useNavigation } from '@react-navigation/native';

type NavProp = NativeStackNavigationProp<OptionsStackParamList, 'PaymentMethods'>;

const SAVED_METHODS = [
  { id: '1', type: 'CARD', label: 'Visa ending in 4242', icon: 'visa' },
  { id: '2', type: 'EWALLET', label: 'GCash (0917 *** 8888)', icon: 'gcash' },
];

export function usePayments() {
  const navigation = useNavigation<NavProp>();

  return {
    savedMethods: SAVED_METHODS,
    navigation,
  };
}
