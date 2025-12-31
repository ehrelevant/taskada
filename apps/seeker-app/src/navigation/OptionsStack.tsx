import { AddCardScreen } from '@screens/options/paymentMethods/AddCardScreen';
import { AddEWalletScreen } from '@screens/options/paymentMethods/AddEWalletScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/OptionsScreen';
import { PaymentMethodsScreen } from '@screens/options/paymentMethods/PaymentMethodsScreen';
import { ProfileScreen } from '@screens/options/profile/ProfileScreen';
import { TransactionHistoryScreen } from '@screens/options/transactionHistory/TransactionHistoryScreen';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
  AddCard: undefined;
  AddEWallet: undefined;
  TransactionHistory: undefined;
};

const Stack = createNativeStackNavigator<OptionsStackParamList>();

export function OptionsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Options"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="Options"
        component={OptionsScreen}
        options={{ title: 'Options' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ title: 'Payment Methods' }}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={{ title: 'Add Card' }}
      />
      <Stack.Screen
        name="AddEWallet"
        component={AddEWalletScreen}
        options={{ title: 'Add E-Wallet' }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{ title: 'Transaction History' }}
      />
    </Stack.Navigator>
  );
}