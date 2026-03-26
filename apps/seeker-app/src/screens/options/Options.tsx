import { Avatar, Button, MenuButton, ScreenContainer, SectionHeader, Typography } from '@repo/components';
import { ColorScheme, useTheme } from '@repo/theme';
import { CreditCard, LogOut, MessageSquareWarning, Moon, Sun, UserPen } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { createStyles } from './Options.styles';
import { useOptions } from './Options.hooks';

export function OptionsScreen() {
  const { colors, colorScheme, setColorScheme } = useTheme();
  const styles = createStyles(colors);
  const { userSession, profile, signOut } = useOptions();
  const navigation = useNavigation<NativeStackNavigationProp<OptionsStackParamList>>();

  if (userSession === null) {
    return <View style={styles.emptyContainer} />;
  }

  const { user } = userSession;

  const cycleTheme = () => {
    const order: ColorScheme[] = ['system', 'light', 'dark'];
    const nextIndex = (order.indexOf(colorScheme) + 1) % order.length;
    setColorScheme(order[nextIndex]);
  };

  const getThemeIcon = () => {
    if (colorScheme === 'dark') return <Moon size={24} color={colors.secondary.base} />;
    if (colorScheme === 'light') return <Sun size={24} color={colors.secondary.base} />;
    return <Sun size={24} color={colors.textDisabled} />;
  };

  const getThemeLabel = () => {
    if (colorScheme === 'dark') return 'Dark Mode';
    if (colorScheme === 'light') return 'Light Mode';
    return 'System Theme';
  };

  return (
    <ScreenContainer scrollable padding="none" verticalPadding="none">
      <View style={styles.profileSection}>
        <Avatar
          source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
          name={`${user.name} ${user.lastName}`}
          size={80}
          borderColor={colors.secondary.base}
          borderWidth={3}
        />
        <Typography variant="h3" weight="bold" style={styles.userName}>
          {user.name} {user.lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.email}
        </Typography>
      </View>

      <View style={styles.menuSection}>
        <SectionHeader title="Account" style={styles.sectionHeader} />

        <MenuButton
          title="Manage Profile"
          icon={<UserPen size={24} color={colors.secondary.base} />}
          onPress={() => navigation.navigate('Profile')}
          style={styles.menuButton}
        />
        <MenuButton
          title="Manage Payment Methods"
          icon={<CreditCard size={24} color={colors.secondary.base} />}
          onPress={() => navigation.navigate('PaymentMethods')}
          style={styles.menuButton}
        />

        <SectionHeader title="Preferences" style={styles.sectionHeader} />

        <MenuButton title={getThemeLabel()} icon={getThemeIcon()} onPress={cycleTheme} style={styles.menuButton} />

        <SectionHeader title="Support" style={styles.sectionHeader} />

        <MenuButton
          title="Report Issue"
          icon={<MessageSquareWarning size={24} color={colors.secondary.base} />}
          onPress={() => undefined}
          style={styles.menuButton}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Sign Out"
          variant="outline"
          onPress={signOut}
          leftIcon={<LogOut size={20} color={colors.error.base} />}
          style={styles.signOutButton}
        />
      </View>
    </ScreenContainer>
  );
}
