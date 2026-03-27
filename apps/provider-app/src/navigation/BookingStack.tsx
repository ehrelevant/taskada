import { BookingChatScreen } from '@screens/home/booking/chat/BookingChat';
import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingFinalizeScreen } from '@screens/home/booking/finalize/BookingFinalize';
import { BookingServingScreen } from '@screens/home/booking/serving/BookingServing';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportScreen } from '@screens/report/Report';

export type BookingStackParamList = {
  BookingChat: {
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
  BookingFinalize: {
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
  BookingServing: {
    bookingId: string;
  };
  BookingDone: {
    bookingId: string;
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

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingStack() {
  return (
    <Stack.Navigator
      initialRouteName="BookingChat"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="BookingChat"
        component={BookingChatScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingFinalize"
        component={BookingFinalizeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingTransit"
        component={BookingTransitScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingServing"
        component={BookingServingScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingDone"
        component={BookingDoneScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
