import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const displayName =
    user?.name?.trim() ||
    user?.email?.split('@')[0] ||
    'User';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => router.push('/(tabs)/profile')}
        style={styles.profile}
        accessibilityRole="button"
        accessibilityLabel={`View ${displayName}'s profile`}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <Text style={styles.userName} numberOfLines={1}>
          {displayName}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 17,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 12,
    maxWidth: '100%',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.blushPink,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  userName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
});