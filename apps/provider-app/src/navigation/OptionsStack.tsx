import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/OptionsScreen';
import { PayoutMethodsScreen } from '@screens/options/payoutMethods/PayoutMethodsScreen';
import { ProfileScreen } from '@screens/options/profile/ProfileScreen';

export type OptionsStackParamList = {
  Options: undefined;
  Profile: undefined;
  PayoutMethods: undefined;
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
        name="PayoutMethods"
        component={PayoutMethodsScreen}
        options={{
          title: 'Payout Methods',
        }}
      />
    </Stack.Navigator>
  );
}

