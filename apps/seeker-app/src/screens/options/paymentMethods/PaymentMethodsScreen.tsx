import { Button } from '@repo/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export function PaymentMethodsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Add GCash" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 10,
  },
});
