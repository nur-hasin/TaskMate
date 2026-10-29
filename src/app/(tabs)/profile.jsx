import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import useTasks from '../../hooks/useTasks';
import COLORS from '../../theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { tasks, pendingCount, completedCount } = useTasks();
  const router = useRouter();

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  async function handleLogout() {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch {
      // Handled by AuthContext
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'U'}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tasks created</Text>
            <Text style={styles.detailValue}>{tasks.length}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Completed</Text>
            <Text style={styles.detailValue}>{completedCount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Still to do</Text>
            <Text style={styles.detailValue}>{pendingCount}</Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>

        <Text style={styles.version}>TaskMate · Your personal task space</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 17,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: 'center',
  },
  avatar: {
  width: 72,
  height: 72,
  borderRadius: 25,
  backgroundColor: '#FFE8E3',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#E25B45',
},
avatarText: {
  color: '#E25B45',
  fontSize: 28,
  fontWeight: '900',
  textAlign: 'center',
},
  name: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 13,
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: 21,
  },
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
  },
  tipCard: {
    backgroundColor: COLORS.sageLight,
    borderRadius: 17,
    padding: 18,
    marginTop: 15,
  },
  tipTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  tipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  logoutBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '800',
    fontSize: 13,
  },
  version: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 17,
  },
});
