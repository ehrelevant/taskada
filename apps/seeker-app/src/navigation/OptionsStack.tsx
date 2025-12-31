import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/OptionsScreen';
import { PaymentMethodsScreen } from '@screens/options/paymentMethods/PaymentMethodsScreen';
import { ProfileScreen } from '@screens/options/profile/ProfileScreen';
import { TransactionHistoryScreen } from '@screens/options/transactionHistory/TransactionHistoryScreen';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
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
        options={{
          title: 'Options',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{
          title: 'Payment Methods',
        }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{
          title: 'Transaction History',
        }}
      />
    </Stack.Navigator>
  );
}
