import { Avatar, Button, MenuButton, ScreenContainer, Typography } from '@repo/components';
import { ColorScheme, useTheme } from '@repo/theme';
import { CreditCard, LogOut, MessageSquareWarning, Moon, Sun, UserPen } from 'lucide-react-native';
import { View } from 'react-native';

import { createStyles } from './Options.styles';
import { useOptionsScreen } from './Options.hooks';

export function OptionsScreen() {
  const { colors, colorScheme, setColorScheme } = useTheme();
  const styles = createStyles(colors);

  const { userSession, profile, signOut, navigation } = useOptionsScreen();

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
    if (colorScheme === 'dark') return <Moon size={24} color={colors.actionPrimary} />;
    if (colorScheme === 'light') return <Sun size={24} color={colors.actionPrimary} />;
    return <Sun size={24} color={colors.textDisabled} />;
  };

  const getThemeLabel = () => {
    if (colorScheme === 'dark') return 'Dark Mode';
    if (colorScheme === 'light') return 'Light Mode';
    return 'System Theme';
  };

  return (
    <ScreenContainer scrollable padding="m" verticalPadding="none">
      <View style={styles.profileSection}>
        <Avatar
          source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
          name={`${user.name} ${user.lastName}`}
          size={100}
        />
        <Typography variant="h4" weight="bold" style={styles.userName}>
          {user.name} {user.lastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.email}
        </Typography>
      </View>

      <View style={styles.menuSection}>
        <Typography variant="h6" style={styles.sectionTitle}>
          Account
        </Typography>

        <MenuButton
          title="Manage Profile"
          icon={<UserPen size={24} color={colors.actionPrimary} />}
          onPress={() => navigation.navigate('Profile')}
          style={styles.menuButton}
        />
        <MenuButton
          title="Manage Payment Methods"
          icon={<CreditCard size={24} color={colors.actionPrimary} />}
          onPress={() => navigation.navigate('Payments')}
          style={styles.menuButton}
        />

        <Typography variant="h6" style={styles.sectionTitle}>
          Preferences
        </Typography>

        <MenuButton title={getThemeLabel()} icon={getThemeIcon()} onPress={cycleTheme} style={styles.menuButton} />

        <Typography variant="h6" style={styles.sectionTitle}>
          Support
        </Typography>

        <MenuButton
          title="Report Issue"
          icon={<MessageSquareWarning size={24} color={colors.actionPrimary} />}
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
