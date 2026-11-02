import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import COLORS from '../theme/colors';

export default function LoadingView({
  message = 'Getting things ready…',
}) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/android-icon-foreground.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="TaskMate logo"
      />

      <Text style={styles.brandName}>TaskMate</Text>

      <ActivityIndicator
        color={COLORS.primary}
        size="large"
        style={styles.loader}
      />

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
  logo: {
    width: 180,
    height: 180,
  },
  brandName: {
    marginTop: 6,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.text,
  },
  loader: {
    marginTop: 32,
    marginBottom: 12,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});