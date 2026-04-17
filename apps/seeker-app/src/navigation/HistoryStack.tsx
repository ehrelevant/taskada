import { BookingLogsScreen } from '@screens/history/bookingLogs/BookingLogs';
import { ChatLogsScreen } from '@screens/history/chatLogs/ChatLogs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryScreen } from '@screens/history/History';
import { ReportScreen } from '@screens/report/Report';
import { RequestLogsScreen } from '@screens/history/requestLogs/RequestLogs';
import { StackHeader } from '@repo/components';

export type HistoryStackParamList = {
  History: undefined;
  BookingLogs: { bookingId: string };
  RequestLogs: { bookingId: string };
  ChatLogs: {
    bookingId: string;
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
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

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="History"
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
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Transaction History',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingLogs"
        component={BookingLogsScreen}
        options={{
          title: 'Booking Details',
        }}
      />
      <Stack.Screen
        name="RequestLogs"
        component={RequestLogsScreen}
        options={{
          title: 'Request Details',
        }}
      />
      <Stack.Screen
        name="ChatLogs"
        component={ChatLogsScreen}
        options={{
          title: 'Chat History',
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
