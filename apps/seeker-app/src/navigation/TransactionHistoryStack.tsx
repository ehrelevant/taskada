import { ChatLogsScreen } from '@screens/history/ChatLogsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RequestDetailsSummaryScreen } from '@screens/history/RequestDetailsSummaryScreen';
import { TransactionDetailsScreen } from '@screens/history/TransactionDetailsScreen';
import { TransactionHistoryListScreen } from '@screens/history/TransactionHistoryListScreen';

export type TransactionHistoryStackParamList = {
  TransactionHistoryList: undefined;
  TransactionDetails: { bookingId: string };
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
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={{
          title: 'Transaction Details',
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
