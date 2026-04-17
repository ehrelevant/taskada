import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { History, Home, Menu } from 'lucide-react-native';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@repo/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@repo/theme';

import { BookingStack } from './BookingStack';
import { BookingStackParamList } from './BookingStack';
import { HistoryStack } from './HistoryStack';
import { HistoryStackParamList } from './HistoryStack';
import { HomeStack } from './HomeStack';
import { HomeStackParamList } from './HomeStack';
import { OptionsStack } from './OptionsStack';
import { OptionsStackParamList } from './OptionsStack';

export type DashboardTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  HistoryStack: NavigatorScreenParams<HistoryStackParamList> | undefined;
  OptionsStack: NavigatorScreenParams<OptionsStackParamList> | undefined;
  BookingStack: NavigatorScreenParams<BookingStackParamList> | undefined;
};

const Tab = createBottomTabNavigator<DashboardTabsParamList>();

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { bottom: bottomInset } = useSafeAreaInsets();

  if (state.routes[state.index]?.name === 'BookingStack') {
    return null;
  }

  return (
    <View
      style={[
        styles.tabsContainer,
        {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
          paddingBottom: bottomInset,
          height: 64 + bottomInset,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Do not render if tabBarButton is disabled
        if (options.tabBarButton) return null;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const renderIcon = () => {
          const iconProps = {
            size: 24,
            color: isFocused ? colors.actionPrimary : colors.textDisabled,
            strokeWidth: 2,
          };

          if (route.name === 'HomeStack') {
            return <Home {...iconProps} />;
          } else if (route.name === 'HistoryStack') {
            return <History {...iconProps} />;
          } else {
            return <Menu {...iconProps} />;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`${label} tab`}
            accessibilityState={isFocused ? { selected: true } : {}}
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={styles.tabContent}>
              {renderIcon()}
              <Typography variant="caption" color={isFocused ? 'actionPrimary' : 'textDisabled'} style={styles.label}>
                {label.toString()}
              </Typography>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function DashboardTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeStack"
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} options={{ title: 'History' }} />
      <Tab.Screen name="OptionsStack" component={OptionsStack} options={{ title: 'Options' }} />
      <Tab.Screen
        name="BookingStack"
        component={BookingStack}
        options={{
          title: 'Bookings',
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
});
