import { BookingChatScreen } from '@screens/home/booking/chat/BookingChat';
import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingFinalizeScreen } from '@screens/home/booking/finalize/BookingFinalize';
import { BookingServingScreen } from '@screens/home/booking/serving/BookingServing';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportScreen } from '@screens/report/Report';
import { RequestDetailsScreen } from '@screens/home/request/details/RequestDetails';
import { RequestListScreen } from '@screens/home/request/list/RequestList';

export type RequestsStackParamList = {
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
  BookingDone: { bookingId: string };
  BookingServing: { bookingId: string };
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
  Report: {
    bookingId: string;
    reportedUser: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
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
        component={BookingChatScreen}
        options={{
          title: 'Chat',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FinalizeDetails"
        component={BookingFinalizeScreen}
        options={{
          title: 'Finalize Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingServing"
        component={BookingServingScreen}
        options={{
          title: 'Serving',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingDone"
        component={BookingDoneScreen}
        options={{
          title: 'Completed',
          headerShown: false,
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
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Report User',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
