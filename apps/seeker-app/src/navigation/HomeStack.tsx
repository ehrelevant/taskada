import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/home/HomeScreen';
import { RequestFormScreen } from '@screens/request-form/RequestFormScreen';
import { ServiceDetailsScreen } from '@screens/service-details/ServiceDetailsScreen';
import { ServiceTypesListScreen } from '@screens/service-types/ServiceTypesListScreen';

export type HomeStackParamList = {
  Home: undefined;
  ServiceTypesList: undefined;
  ServiceDetails: { serviceId: string; returnTo?: 'RequestForm' };
  RequestForm: {
    serviceTypeId?: string;
    serviceId?: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ServiceTypesList"
        component={ServiceTypesListScreen}
        options={{
          title: 'All Services',
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{
          title: 'Service Details',
        }}
      />
      <Stack.Screen
        name="RequestForm"
        component={RequestFormScreen}
        options={{
          title: 'Request Service',
        }}
      />
    </Stack.Navigator>
  );
}
