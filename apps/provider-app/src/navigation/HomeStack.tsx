import { BookingChatScreen } from '@screens/home/booking/BookingChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/home/HomeScreen';
import { RequestDetailsScreen } from '@screens/home/request/RequestDetailsScreen';
import { RequestListScreen } from '@screens/home/request/RequestListScreen';
import { TransactionDoneScreen } from '@screens/home/transaction/TransactionDoneScreen';
import { TransactionServingScreen } from '@screens/home/transaction/TransactionServingScreen';
import { TransactionTransitScreen } from '@screens/home/transaction/TransactionTransitScreen';

export type HomeStackParamList = {
  Home: undefined;
  RequestList: undefined;
  RequestDetails: undefined;
  BookingChat: undefined;
  BookingDetails: undefined;
  TransactionTransit: undefined;
  TransactionServing: undefined;
  TransactionDone: undefined;
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
        }}
      />
      <Stack.Screen
        name="RequestList"
        component={RequestListScreen}
        options={{
          title: 'Request List',
        }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{
          title: 'Request Details',
        }}
      />
      <Stack.Screen
        name="BookingChat"
        component={BookingChatScreen}
        options={{
          title: 'Booking Chat',
        }}
      />
      <Stack.Screen
        name="TransactionTransit"
        component={TransactionTransitScreen}
        options={{
          title: 'Transaction Transit',
        }}
      />
      <Stack.Screen
        name="TransactionServing"
        component={TransactionServingScreen}
        options={{
          title: 'Transaction Serving',
        }}
      />
      <Stack.Screen
        name="TransactionDone"
        component={TransactionDoneScreen}
        options={{
          title: 'Transaction Done',
        }}
      />
    </Stack.Navigator>
  );
}


