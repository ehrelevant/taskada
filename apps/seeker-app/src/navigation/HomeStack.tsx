import { BookingTransitScreen } from '@screens/home/booking/BookingTransitScreen';
import { ChatScreen } from '@screens/home/chat/ChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/home/HomeScreen';
import { RequestFormScreen } from '@screens/request-form/RequestFormScreen';
import { ServiceDetailsScreen } from '@screens/service-details/ServiceDetailsScreen';
import { ServiceTypesListScreen } from '@screens/service-types/ServiceTypesListScreen';
import { StandbyScreen } from '@screens/standby/StandbyScreen';
import { ViewProposalScreen } from '@screens/home/proposal/ViewProposalScreen';

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
        component={ViewProposalScreen}
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
    </Stack.Navigator>
  );
}
