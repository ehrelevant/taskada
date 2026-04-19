import { BookingDetailsScreen } from '@screens/home/booking/details/BookingDetails';
import { BookingDoneScreen } from '@screens/home/booking/done/BookingDone';
import { BookingLogsScreen } from '@screens/history/bookingLogs/BookingLogs';
import { BookingProposalScreen } from '@screens/home/booking/proposal/BookingProposal';
import { BookingServingScreen } from '@screens/home/booking/serving/BookingServing';
import { BookingTransitScreen } from '@screens/home/booking/transit/BookingTransit';
import { CalendarClock, FileText, Flag, MessageSquareText } from 'lucide-react-native';
import { ChatLogsScreen } from '@screens/history/chatLogs/ChatLogs';
import { ChatScreen } from '@screens/home/booking/chat/BookingChat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportScreen } from '@screens/report/Report';
import { RequestLogsScreen } from '@screens/history/requestLogs/RequestLogs';
import { StackHeader } from '@repo/components';
import { StandbyScreen } from '@screens/home/request/standby/Standby';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@repo/theme';

interface OtherUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export type BookingStackParamList = {
  Standby: {
    requestId: string;
  };
  BookingChat: {
    bookingId: string;
    otherUser: OtherUser;
    requestId: string;
  };
  BookingProposal: {
    bookingId: string;
    otherUser: OtherUser;
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
    otherUser: OtherUser;
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
  BookingServing: {
    bookingId: string;
    otherUser: OtherUser;
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
  BookingDone: {
    bookingId: string;
    otherUser: OtherUser;
    serviceTypeName: string;
    cost: number;
    requestId: string;
  };
  BookingDetails: {
    bookingId: string;
  };
  BookingLogs: {
    bookingId: string;
  };
  RequestLogs: {
    bookingId: string;
  };
  ChatLogs: {
    bookingId: string;
    otherUser: OtherUser;
  };
  Report: {
    bookingId: string;
    reportedUser: OtherUser;
  };
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingStack() {
  const { colors } = useTheme();

  const shouldHideBackButton = (routeName: keyof BookingStackParamList): boolean => {
    return (
      routeName === 'Standby' ||
      routeName === 'BookingChat' ||
      routeName === 'BookingProposal' ||
      routeName === 'BookingTransit' ||
      routeName === 'BookingServing' ||
      routeName === 'BookingDone'
    );
  };

  const getReportContext = (route: {
    name: keyof BookingStackParamList;
    params?: object;
  }): { bookingId: string; reportedUser: BookingStackParamList['Report']['reportedUser'] } | null => {
    if (
      route.name === 'BookingChat' ||
      route.name === 'BookingProposal' ||
      route.name === 'BookingTransit' ||
      route.name === 'BookingServing' ||
      route.name === 'BookingDone'
    ) {
      const params = route.params as
        | BookingStackParamList['BookingChat']
        | BookingStackParamList['BookingProposal']
        | BookingStackParamList['BookingTransit']
        | BookingStackParamList['BookingServing']
        | BookingStackParamList['BookingDone'];

      return {
        bookingId: params.bookingId,
        reportedUser: params.otherUser,
      };
    }

    return null;
  };

  return (
    <Stack.Navigator
      initialRouteName="Standby"
      screenOptions={{
        animationDuration: 400,
        header: ({ navigation, options, route, back }) => (
          <StackHeader
            title={typeof options.title === 'string' ? options.title : route.name}
            canGoBack={Boolean(back) && !shouldHideBackButton(route.name as keyof BookingStackParamList)}
            onBack={() => {
              navigation.goBack();
            }}
            rightContent={
              <View style={styles.headerActions}>
                {(route.name === 'BookingChat' ||
                  route.name === 'BookingProposal' ||
                  route.name === 'BookingTransit' ||
                  route.name === 'BookingServing' ||
                  route.name === 'BookingDone') && (
                  <TouchableOpacity
                    onPress={() => {
                      const params = route.params as
                        | BookingStackParamList['BookingChat']
                        | BookingStackParamList['BookingProposal']
                        | BookingStackParamList['BookingTransit']
                        | BookingStackParamList['BookingServing']
                        | BookingStackParamList['BookingDone'];

                      navigation.navigate('RequestLogs', {
                        bookingId: params.bookingId,
                      });
                    }}
                    style={styles.headerActionButton}
                  >
                    <FileText size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}

                {(route.name === 'BookingTransit' ||
                  route.name === 'BookingServing' ||
                  route.name === 'BookingDone') && (
                  <TouchableOpacity
                    onPress={() => {
                      const params = route.params as
                        | BookingStackParamList['BookingTransit']
                        | BookingStackParamList['BookingServing']
                        | BookingStackParamList['BookingDone'];

                      navigation.navigate('ChatLogs', {
                        bookingId: params.bookingId,
                        otherUser: params.otherUser,
                      });
                    }}
                    style={styles.headerActionButton}
                  >
                    <MessageSquareText size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}

                {(route.name === 'BookingTransit' ||
                  route.name === 'BookingServing' ||
                  route.name === 'BookingDone') && (
                  <TouchableOpacity
                    onPress={() => {
                      const params = route.params as
                        | BookingStackParamList['BookingTransit']
                        | BookingStackParamList['BookingServing']
                        | BookingStackParamList['BookingDone'];

                      navigation.navigate('BookingLogs', {
                        bookingId: params.bookingId,
                      });
                    }}
                    style={styles.headerActionButton}
                  >
                    <CalendarClock size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}

                {getReportContext(route as { name: keyof BookingStackParamList; params?: object }) && (
                  <TouchableOpacity
                    onPress={() => {
                      const context = getReportContext(route as { name: keyof BookingStackParamList; params?: object });
                      if (!context) return;

                      navigation.navigate('Report', context);
                    }}
                    style={styles.headerActionButton}
                  >
                    <Flag size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        ),
      }}
    >
      <Stack.Screen
        name="Standby"
        component={StandbyScreen}
        options={{
          title: 'Finding Providers',
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookingChat"
        component={ChatScreen}
        options={{
          title: 'Service Chat',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingProposal"
        component={BookingProposalScreen}
        options={{
          title: 'Service Proposal',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingTransit"
        component={BookingTransitScreen}
        options={{
          title: 'Provider in Transit',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingServing"
        component={BookingServingScreen}
        options={{
          title: 'Currently Serving',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingDone"
        component={BookingDoneScreen}
        options={{
          title: 'Booking Complete',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          title: 'Booking Details',
        }}
      />
      <Stack.Screen
        name="BookingLogs"
        component={BookingLogsScreen}
        options={{
          title: 'Booking Logs',
        }}
      />
      <Stack.Screen
        name="RequestLogs"
        component={RequestLogsScreen}
        options={{
          title: 'Request Logs',
        }}
      />
      <Stack.Screen
        name="ChatLogs"
        component={ChatLogsScreen}
        options={{
          title: 'Chat Logs',
        }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Report User',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  headerActionButton: {
    padding: 2,
  },
});
