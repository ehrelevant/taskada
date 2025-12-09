import { authClient } from '@lib/authClient';
import { Button } from '@repo/components';
import { colors } from '@repo/theme';
import { FileClock, UserPen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useLoading } from '@contexts/LoadingContext';

export function OptionsScreen() {
  const { setLoading } = useLoading();

  const signOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Manage Profile" variant="outline" style={styles.button} leftIcon={
        <UserPen size={24} color={colors.actionPrimary} />
      }/>
      <Button title="View Transaction History" variant="outline" style={styles.button} leftIcon={
        <FileClock size={24} color={colors.actionPrimary} />
      }/>
      <Button title="Sign Out" variant="primary" onPress={signOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 6,
    paddingHorizontal: 10,
  },
  button: {
    gap: 10,
  }
});
