import { BookingLogsScreen } from '@screens/history/bookingLogs/BookingLogs';
import { ChatLogsScreen } from '@screens/history/chatLogs/ChatLogs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryScreen } from '@screens/history/History';
import { ReportScreen } from '@screens/report/Report';
import { RequestLogsScreen } from '@screens/history/requestLogs/RequestLogs';

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
      }}
    >
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Transaction History',
        }}
      />
      <Stack.Screen
        name="BookingLogs"
        component={BookingLogsScreen}
        options={{
          title: 'Booking Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestLogs"
        component={RequestLogsScreen}
        options={{
          title: 'Request Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatLogs"
        component={ChatLogsScreen}
        options={{
          title: 'Chat History',
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
