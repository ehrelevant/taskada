import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OptionsScreen } from '@screens/options/OptionsScreen';
import { PayoutMethodsScreen } from '@screens/options/payouts/PayoutMethodsScreen';


export type OptionsStackParamList = {
  Options: undefined;
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
        name="PayoutMethods"
        component={PayoutMethodsScreen}
        options={{
          title: 'Payout Methods',
        }}
      />
    </Stack.Navigator>
  );
}

