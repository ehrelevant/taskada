import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesScreen } from '@screens/services/Services';

export type ServicesStackParamList = {
  ServiceList: undefined;
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator
      initialRouteName="ServiceList"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="ServiceList"
        component={ServicesScreen}
        options={{
          title: 'Services',
        }}
      />
    </Stack.Navigator>
  );
}
