import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingProposalScreen } from '@screens/home/booking/proposal/BookingProposal';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { ChatScreen } from '@screens/home/booking/chat/BookingChat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/home/Home';
import { ReportScreen } from '@screens/report/Report';
import { RequestFormScreen } from '@screens/home/request/form/RequestForm';
import { ServiceDetailsScreen } from '@screens/home/service/details/ServiceDetails';
import { ServiceTypesListScreen } from '@screens/home/service/types/ServiceTypes';
import { StandbyScreen } from '@screens/home/request/standby/Standby';

export type HomeStackParamList = {
  Home: undefined;
  ServiceTypesList: undefined;
  ServiceDetails: { serviceId: string; returnTo?: 'RequestForm' };
  RequestForm: {
    serviceTypeId?: string;
    serviceId?: string;
  };
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
      <Stack.Screen
        name="Standby"
        component={StandbyScreen}
        options={{
          title: 'Finding Provider',
          headerBackVisible: false,
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
        name="ViewProposal"
        component={BookingProposalScreen}
        options={{
          title: 'Service Proposal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingTransit"
        component={BookingTransitScreen}
        options={{
          title: 'Provider In Transit',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingComplete"
        component={BookingDoneScreen}
        options={{
          title: 'Service Complete',
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
