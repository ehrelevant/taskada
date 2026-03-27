import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RequestDetailsScreen } from '@screens/home/request/details/RequestDetails';
import { RequestListScreen } from '@screens/home/request/list/RequestList';
import { StackHeader } from '@repo/components';

export type RequestsStackParamList = {
  RequestList: undefined;
  RequestDetails: { requestId: string };
};

const Stack = createNativeStackNavigator<RequestsStackParamList>();

export function RequestsStack() {
  return (
    <Stack.Navigator
      initialRouteName="RequestList"
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
        name="RequestList"
        component={RequestListScreen}
        options={{
          title: 'Request List',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{
          title: 'Request Details',
        }}
      />
    </Stack.Navigator>
  );
}
