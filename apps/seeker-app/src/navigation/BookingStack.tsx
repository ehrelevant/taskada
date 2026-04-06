import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingProposalScreen } from '@screens/home/booking/proposal/BookingProposal';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { ChatScreen } from '@screens/home/booking/chat/BookingChat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportScreen } from '@screens/report/Report';
import { StackHeader } from '@repo/components';
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
  BookingProposal: {
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
  BookingDone: {
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
        name="BookingProposal"
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
