import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardList, HardHat, History, Menu } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@repo/components';
import { useTheme } from '@repo/theme';

import { BookingStack } from './BookingStack';
import { HistoryStack } from './HistoryStack';
import { OptionsStack } from './OptionsStack';
import { RequestsStack } from './RequestsStack';
import { ServicesStack } from './ServicesStack';

export type DashboardTabsParamList = {
  RequestsStack: undefined;
  ServicesStack: undefined;
  HistoryStack: undefined;
  OptionsStack: undefined;
  BookingStack: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabsParamList>();

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.tabsContainer, { backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }]}
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

          if (route.name === 'RequestsStack') {
            return <ClipboardList {...iconProps} />;
          } else if (route.name === 'ServicesStack') {
            return <HardHat {...iconProps} />;
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
      initialRouteName="RequestsStack"
    >
      <Tab.Screen name="RequestsStack" component={RequestsStack} options={{ title: 'Requests' }} />
      <Tab.Screen name="ServicesStack" component={ServicesStack} options={{ title: 'Services' }} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} options={{ title: 'History' }} />
      <Tab.Screen name="OptionsStack" component={OptionsStack} options={{ title: 'Options' }} />
      <Tab.Screen
        name="BookingStack"
        component={BookingStack}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    height: 64,
    paddingTop: 8,
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
