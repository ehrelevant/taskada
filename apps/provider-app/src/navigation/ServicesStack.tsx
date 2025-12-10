import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServiceDetailsScreen } from '@screens/services/ServiceDetailsScreen';
import { ServiceListScreen } from '@screens/services/ServiceListScreen';

export type OptionsStackParamList = {
  ServiceList: undefined;
  ServiceDetails: undefined;
};

const Stack = createNativeStackNavigator<OptionsStackParamList>();

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
        component={ServiceListScreen}
        options={{
          title: 'Services',
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{
          title: 'Service Details',
        }}
      />
    </Stack.Navigator>
  );
}


