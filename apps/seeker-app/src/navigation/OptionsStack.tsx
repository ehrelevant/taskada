import { apiFetch } from '@lib/helpers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/OptionsScreen';
import { PaymentMethodLinkingScreen, PaymentMethodsScreen } from '@repo/screens';
import { ProfileScreen } from '@screens/options/profile/ProfileScreen';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
  AddCard: undefined;
  AddEWallet: undefined;
  TransactionHistory: undefined;
  PaymentMethodLinking: undefined;
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
      <Stack.Screen name="Options" component={OptionsScreen} options={{ title: 'Options' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="PaymentMethods" options={{ title: 'Payment Methods' }}>
        {({ navigation }) => <PaymentMethodsScreen apiFetch={apiFetch} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="PaymentMethodLinking" options={{ title: 'Payment Method Linking' }}>
        {({ navigation }) => <PaymentMethodLinkingScreen apiFetch={apiFetch} navigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
