import { authClient } from '@lib/authClient';
import { Avatar, Button, MenuButton, ScreenContainer, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { CreditCard, FileClock, LogOut, MessageSquareWarning, UserPen } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { styles } from './OptionsScreen.styles';

type OptionsNavProp = NativeStackNavigationProp<OptionsStackParamList, 'Options'>;

export function OptionsScreen() {
  const { setLoading } = useLoading();
  const navigation = useNavigation<OptionsNavProp>();

  const signOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  const { data: userSession } = authClient.useSession();

  if (userSession === null) {
    return <View style={styles.emptyContainer} />;
  }

  const { user } = userSession;

  return (
    <ScreenContainer scrollable padding="m">
      <View style={styles.profileSection}>
        <Avatar source={user.image ? { uri: user.image } : null} name={`${user.name} ${user.lastName}`} size={100} />
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
          onPress={() => navigation.navigate('PaymentMethods')}
          style={styles.menuButton}
        />
        <MenuButton
          title="View Transaction History"
          icon={<FileClock size={24} color={colors.actionPrimary} />}
          onPress={() => undefined}
          style={styles.menuButton}
        />

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
          leftIcon={<LogOut size={20} color={colors.error} />}
          style={styles.signOutButton}
        />
      </View>
    </ScreenContainer>
  );
}
