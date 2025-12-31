import { authClient } from '@lib/authClient';
import { colors, spacing } from '@repo/theme';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@repo/components';

export function ProfileScreen() {
  const { data: session } = authClient.useSession();

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Typography variant="h4" color={colors.white}>
            {session?.user?.name?.charAt(0)}
          </Typography>
        </View>
        <Typography variant="h5" style={styles.name}>
          {session?.user?.name}
        </Typography>
        <Typography variant="body2" color={colors.textSecondary}>
          {session?.user?.email}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.l,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  name: {
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: 'auto',
  },
});

