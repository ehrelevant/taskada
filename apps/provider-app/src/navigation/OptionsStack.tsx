import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/Options';
import { PaymentMethodLinkingScreen, PaymentMethodsScreen } from '@repo/screens';
import { ProfileScreen } from '@screens/options/profile/Profile';
import { providerClient } from '@lib/providerClient';
import { StackHeader } from '@repo/components';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PaymentMethods: undefined;
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
      <Stack.Screen name="PaymentMethods" options={{ title: 'Payment Methods' }}>
        {({ navigation }) => (
          <PaymentMethodsScreen apiFetch={(...args) => providerClient.apiFetch(...args)} navigation={navigation} />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentMethodLinking" options={{ title: 'Payment Method Linking' }}>
        {({ navigation }) => (
          <PaymentMethodLinkingScreen
            apiFetch={(...args) => providerClient.apiFetch(...args)}
            navigation={navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
