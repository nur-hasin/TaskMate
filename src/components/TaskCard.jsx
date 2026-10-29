import {
  Bookmark,
  BookmarkCheck,
  PenLine,
  Trash2,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import COLORS from '../theme/colors';
import { formatDate } from '../utils/date';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onToggleSavedForLater,
  showEdit = true,
}) {
  const isSavedForLater =
    !task.completed && Boolean(task.savedForLater);

  const iconColor = COLORS.textSecondary;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={
            task.completed
              ? `Reopen task: ${task.title}`
              : `Complete task: ${task.title}`
          }
          accessibilityState={{ checked: Boolean(task.completed) }}
          onPress={() => onToggle?.(task)}
          hitSlop={10}
          style={({ pressed }) => [
            styles.checkboxTouch,
            pressed && styles.buttonPressed,
          ]}
        >
          <View
            style={[
              styles.checkbox,
              task.completed && styles.checkboxDone,
            ]}
          >
            {task.completed && (
              <Text style={styles.checkText}>✓</Text>
            )}
          </View>
        </Pressable>

        <View style={styles.body}>
          <Text
            style={[styles.title, task.completed && styles.titleDone]}
          >
            {task.title}
          </Text>

          {!!task.description && (
            <Text style={styles.description}>
              {task.description}
            </Text>
          )}

          <View style={styles.metaRow}>
            <PriorityBadge priority={task.priority} />

            {!!task.dueDate && (
              <Text style={styles.dueDate}>
                Due {formatDate(task.dueDate)}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View
        style={[
          styles.actions,
          isSavedForLater && styles.actionsSaved,
        ]}
      >
        {!isSavedForLater && (
          <View style={styles.leftActions}>
            {showEdit && !task.completed && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Edit task: ${task.title}`}
                onPress={() => onEdit?.(task)}
                hitSlop={4}
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <PenLine
                  size={20}
                  color={iconColor}
                  strokeWidth={2}
                />
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete task: ${task.title}`}
              onPress={() => onDelete?.(task)}
              hitSlop={4}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Trash2
                size={20}
                color={COLORS.error}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        )}

        {!task.completed && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isSavedForLater
                ? 'Return task to To do'
                : 'Save task for later'
            }
            accessibilityState={{ checked: isSavedForLater }}
            onPress={() => onToggleSavedForLater?.(task)}
            hitSlop={4}
            style={({ pressed }) => [
              styles.iconButton,
              isSavedForLater && styles.bookmarkBtnActive,
              pressed && styles.buttonPressed,
            ]}
          >
            {isSavedForLater ? (
              <BookmarkCheck
                size={21}
                color={COLORS.primary}
                strokeWidth={2.2}
              />
            ) : (
              <Bookmark
                size={21}
                color={iconColor}
                strokeWidth={2}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  checkboxTouch: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.sage,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  body: {
    flex: 1,
    paddingTop: 3,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  titleDone: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  dueDate: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 14,
  },
  actionsSaved: {
    justifyContent: 'flex-end',
  },
  leftActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
  width: 38,
  height: 36,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: COLORS.border,
  backgroundColor: COLORS.surface,
  alignItems: 'center',
  justifyContent: 'center',
},
  bookmarkBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  buttonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  },
});
