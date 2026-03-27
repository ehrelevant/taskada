import { AddCardScreen } from '@screens/options/payments/add/card/AddCard';
import { AddEWalletScreen } from '@screens/options/payments/add/eWallet/AddEWallet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/Options';
import { PaymentMethodsScreen } from '@screens/options/payments/Payments';
import { ProfileScreen } from '@screens/options/profile/Profile';
import { StackHeader } from '@repo/components';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
  AddCard: undefined;
  AddEWallet: undefined;
};

const Stack = createNativeStackNavigator<OptionsStackParamList>();

export function OptionsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Options"
      screenOptions={{
        animationDuration: 400,
        header: ({ navigation, options, route, back }) => (
          <StackHeader
            title={typeof options.title === 'string' ? options.title : route.name}
            canGoBack={Boolean(back)}
            onBack={() => navigation.goBack()}
          />
        ),
      }}
    >
      <Stack.Screen name="Options" component={OptionsScreen} options={{ title: 'Options', headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Payment Methods' }} />
      <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'Add Card' }} />
      <Stack.Screen name="AddEWallet" component={AddEWalletScreen} options={{ title: 'Add E-Wallet' }} />
    </Stack.Navigator>
  );
}
