import { BookingDetailsScreen } from '@screens/home/booking/BookingDetailsScreen';
import { BookingTransitScreen } from '@screens/home/booking/BookingTransitScreen';
import { ChatScreen } from '@screens/home/chat/ChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinalizeDetailsScreen } from '@screens/home/booking/FinalizeDetailsScreen';
import { RequestDetailsScreen } from '@screens/home/request/RequestDetailsScreen';
import { RequestListScreen } from '@screens/home/request/RequestListScreen';
import { TransactionDoneScreen } from '@screens/home/transaction/TransactionDoneScreen';
import { TransactionServingScreen } from '@screens/home/transaction/TransactionServingScreen';
import { TransactionTransitScreen } from '@screens/home/transaction/TransactionTransitScreen';

export type RequestsStackParamList = {
  Home: undefined;
  RequestList: undefined;
  RequestDetails: { requestId: string };
  Chat: {
    bookingId: string;
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    requestId: string;
    address: {
      label: string | null;
      coordinates: [number, number];
    };
  };
  FinalizeDetails: {
    bookingId: string;
    seekerLocation: {
      label: string | null;
      coordinates: [number, number];
    };
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    requestId: string;
  };
  TransactionTransit: { bookingId: string };
  TransactionServing: { bookingId: string };
  TransactionDone: undefined;
  BookingTransit: {
    bookingId: string;
    seekerLocation: {
      label: string | null;
      coordinates: [number, number];
    };
    address:
      | {
          label: string | null;
          coordinates: [number, number];
        }
      | undefined;
  };
  BookingDetails: {
    bookingId: string;
  };
};

const Stack = createNativeStackNavigator<RequestsStackParamList>();

export function RequestsStack() {
  return (
    <Stack.Navigator
      initialRouteName="RequestList"
      screenOptions={{
        animationDuration: 400,
      }}
    >
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
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FinalizeDetails"
        component={FinalizeDetailsScreen}
        options={{
          title: 'Finalize Details',
          headerShown: false,
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TransactionDone"
        component={TransactionDoneScreen}
        options={{
          title: 'Transaction Done',
        }}
      />
      <Stack.Screen
        name="BookingTransit"
        component={BookingTransitScreen}
        options={{
          title: 'Navigating to Seeker',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          title: 'Booking Details',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
