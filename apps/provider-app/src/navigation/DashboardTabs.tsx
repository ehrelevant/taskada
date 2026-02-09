import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClipboardList, HardHat, History, Menu } from 'lucide-react-native';
import { colors, palette } from '@repo/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '@repo/components';

import { OptionsStack } from './OptionsStack';
import { RequestsStack } from './RequestsStack';
import { ServicesStack } from './ServicesStack';
import { TransactionHistoryStack } from './TransactionHistoryStack';

export type DashboardTabsParamList = {
  RequestsStack: undefined;
  ServicesStack: undefined;
  TransactionHistoryStack: undefined;
  OptionsStack: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabsParamList>();

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabsContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
            color: isFocused ? colors.actionPrimary : palette.gray500,
            strokeWidth: 2,
          };

          if (route.name === 'RequestsStack') {
            return <ClipboardList {...iconProps} />;
          } else if (route.name === 'ServicesStack') {
            return <HardHat {...iconProps} />;
          } else if (route.name === 'TransactionHistoryStack') {
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
              <Typography
                variant="caption"
                color={isFocused ? colors.actionPrimary : palette.gray500}
                style={styles.label}
              >
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
      <Tab.Screen name="TransactionHistoryStack" component={TransactionHistoryStack} options={{ title: 'History' }} />
      <Tab.Screen name="OptionsStack" component={OptionsStack} options={{ title: 'Options' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    height: 64,
    paddingTop: 8,
    backgroundColor: colors.backgroundSecondary,
    borderTopColor: colors.border,
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
