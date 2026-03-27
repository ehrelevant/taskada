import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesScreen } from '@screens/services/Services';

export type ServicesStackParamList = {
  Services: undefined;
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator
      initialRouteName="Services"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Services',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
