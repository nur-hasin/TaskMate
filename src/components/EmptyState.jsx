import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../theme/colors';

export default function EmptyState({
  icon = '＋',
  title,
  message,
  actionLabel,
  onAction,
}) {
  const iconElement = (
    <View style={styles.iconWrap}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Create a new task"
        >
          {iconElement}
        </Pressable>
      ) : (
        iconElement
      )}

      {!!title && <Text style={styles.title}>{title}</Text>}

      {!!message && <Text style={styles.message}>{message}</Text>}

      {!!actionLabel && !!onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 28,
    paddingVertical: 38,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 250,
    marginTop: 7,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});