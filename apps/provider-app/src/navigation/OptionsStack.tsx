import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaymentMethodLinkingScreen, PaymentMethodsScreen } from '@repo/screens';
import { OptionsScreen } from '@screens/options/Options';
import { ProfileScreen } from '@screens/options/profile/Profile';
import { StackHeader } from '@repo/components';
import { apiFetch } from "@repo/shared";
import { providerClient } from '@lib/providerClient';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  Payments: undefined;
  PaymentMethodLinking: undefined;
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
      <Stack.Screen
        name="Options"
        component={OptionsScreen}
        options={{
          title: 'Options',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen name="Payments" options={{ title: 'Payment Methods' }}>
        {({ navigation }) => <PaymentMethodsScreen apiFetch={providerClient.apiFetch} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="PaymentMethodLinking" options={{ title: 'Payment Method Linking' }}>
        {({ navigation }) => <PaymentMethodLinkingScreen apiFetch={providerClient.apiFetch} navigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
