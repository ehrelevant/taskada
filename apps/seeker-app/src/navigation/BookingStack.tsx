import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingProposalScreen } from '@screens/home/booking/proposal/BookingProposal';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { ChatScreen } from '@screens/home/booking/chat/BookingChat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportScreen } from '@screens/report/Report';
import { StandbyScreen } from '@screens/home/request/standby/Standby';

export type BookingStackParamList = {
  Standby: {
    requestId: string;
  };
  Chat: {
    bookingId: string;
    providerInfo: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    requestId: string;
  };
  ViewProposal: {
    bookingId: string;
    providerInfo: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    proposal: {
      cost: number;
      specifications: string;
      serviceTypeName: string;
      address:
        | {
            label: string | null;
            coordinates: [number, number];
          }
        | undefined;
    };
    requestId: string;
  };
  BookingTransit: {
    bookingId: string;
    providerInfo: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    proposal: {
      cost: number;
      specifications: string;
      serviceTypeName: string;
      address:
        | {
            label: string | null;
            coordinates: [number, number];
          }
        | undefined;
    };
  };
  BookingComplete: {
    bookingId: string;
    providerInfo: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
    serviceTypeName: string;
    cost: number;
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
      initialRouteName="Standby"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="Standby"
        component={StandbyScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ViewProposal"
        component={BookingProposalScreen}
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
        name="BookingComplete"
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
