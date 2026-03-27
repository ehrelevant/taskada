import { Avatar, Button, MenuButton, ScreenContainer, SectionHeader, Typography } from '@repo/components';
import { BadgeCheck, CreditCard, LogOut, Moon, Sun, UserPen } from 'lucide-react-native';
import { ColorScheme, useTheme } from '@repo/theme';
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
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profilePill}>
            <BadgeCheck size={14} color={colors.home.chipText} />
            <Typography variant="caption" color={colors.home.chipText}>
              seeker account
            </Typography>
          </View>
          <Avatar
            source={profile?.avatarUrl ? { uri: profile.avatarUrl } : null}
            name={`${user.name} ${user.lastName}`}
            size={80}
            borderColor={colors.home.heroAccent}
            borderWidth={3}
          />
          <Typography variant="h3" weight="bold" color="textInverse" style={styles.userName}>
            {user.name} {user.lastName}
          </Typography>
          <Typography variant="body2" color="textInverse" style={styles.userSubtitle}>
            {user.email}
          </Typography>
        </View>

        <View style={styles.menuSection}>
          <SectionHeader title="Account" style={[styles.sectionHeader, styles.firstSectionHeader]} />

          <MenuButton
            title="Manage Profile"
            icon={<UserPen size={24} color={colors.actionPrimary} />}
            onPress={() => navigation.navigate('Profile')}
            style={styles.menuButton}
          />
          <MenuButton
            title="Manage Payment Methods"
            icon={<CreditCard size={24} color={colors.actionPrimary} />}
            onPress={() => navigation.navigate('PaymentMethods')}
            style={styles.menuButton}
          />

          <SectionHeader title="Preferences" style={styles.sectionHeader} />

          <MenuButton title={getThemeLabel()} icon={getThemeIcon()} onPress={cycleTheme} style={styles.menuButton} />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCard}>
            <Typography variant="caption" color="textSecondary" style={styles.footerCaption}>
              Sign out on this device. You can sign in again anytime.
            </Typography>
            <Button
              title="Sign Out"
              variant="danger"
              size="large"
              fullWidth
              onPress={signOut}
              leftIcon={<LogOut size={18} color={colors.textInverse} />}
              style={styles.signOutButton}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
