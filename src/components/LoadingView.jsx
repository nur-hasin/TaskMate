import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import COLORS from '../theme/colors';

export default function LoadingView({ message = 'Getting things ready…' }) {
  return (
    <View style={styles.container}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>✓</Text>
      </View>
      <Text style={styles.brandName}>TaskMate</Text>
      <ActivityIndicator color={COLORS.primary} style={styles.spinner} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.blushPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '800',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2.4,
    color: COLORS.text,
    marginTop: 10,
  },
  spinner: {
    marginTop: 22,
    marginBottom: 10,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
