import { BookingDetailsScreen } from '@screens/history/BookingDetailsScreen';
import { ChatLogsScreen } from '@screens/history/ChatLogsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RequestDetailsSummaryScreen } from '@screens/history/RequestDetailsSummaryScreen';
import { TransactionHistoryListScreen } from '@screens/history/TransactionHistoryListScreen';

export type TransactionHistoryStackParamList = {
  TransactionHistoryList: undefined;
  BookingDetails: { bookingId: string };
  RequestDetailsSummary: { bookingId: string };
  ChatLogs: {
    bookingId: string;
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
};

const Stack = createNativeStackNavigator<TransactionHistoryStackParamList>();

export function TransactionHistoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="TransactionHistoryList"
      screenOptions={{
        animationDuration: 400,
      }}
    >
      <Stack.Screen
        name="TransactionHistoryList"
        component={TransactionHistoryListScreen}
        options={{
          title: 'Transaction History',
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
        name="RequestDetailsSummary"
        component={RequestDetailsSummaryScreen}
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
    </Stack.Navigator>
  );
}
