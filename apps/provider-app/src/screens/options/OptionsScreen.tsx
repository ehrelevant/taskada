import { authClient } from '@lib/authClient';
import { Button, Typography } from '@repo/components';
import { colors } from '@repo/theme';
import { CreditCard, FileClock, MessageSquareWarning, UserPen } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OptionsStackParamList } from '@navigation/OptionsStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoading } from '@contexts/LoadingContext';
import { useNavigation } from '@react-navigation/native';

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
    return <View style={styles.container} />;
  }

  const { user } = userSession;

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('@lib/assets/default-profile.jpg')} style={styles.profilePicture} />
      <Typography variant="h1">
        {user.name} {user.lastName}
      </Typography>

      <View style={styles.buttonsContainer}>
        <Button
          title="Manage Profile"
          variant="outline"
          style={styles.button}
          leftIcon={<UserPen size={24} color={colors.actionPrimary} />}
        />
        <Button
          title="Manage Payout Methods"
          variant="outline"
          style={styles.button}
          onPress={() => navigation.navigate('PayoutMethods')}
          leftIcon={<CreditCard size={24} color={colors.actionPrimary} />}
        />
        <Button
          title="View Transaction History"
          variant="outline"
          style={styles.button}
          leftIcon={<FileClock size={24} color={colors.actionPrimary} />}
        />
        <Button
          title="Report Issue"
          variant="outline"
          style={styles.button}
          leftIcon={<MessageSquareWarning size={24} color={colors.actionPrimary} />}
        />
        <Button title="Sign Out" variant="primary" onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  buttonsContainer: {
    flex: 1,
    gap: 6,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  button: {
    gap: 10,
  },
});
