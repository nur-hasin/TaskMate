import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import COLORS from '../theme/colors';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
};

export default function TaskForm({
  initialValues,
  onSave,
  onCancel,
  isEditing = false,
  isSubmitting = false,
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [error, setError] = useState(null);

  function handleSave() {
    const title = form.title.trim();
    if (!title) {
      setError('Add a title for your task first.');
      return;
    }

    const dueDate = form.dueDate.trim();
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      setError('Use YYYY-MM-DD for the due date, or leave it blank.');
      return;
    }

    setError(null);
    onSave?.({
      title,
      description: form.description.trim(),
      priority: form.priority,
      dueDate,
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>
          {isEditing ? 'Edit task' : 'Create a task'}
        </Text>
        <Pressable onPress={onCancel} hitSlop={8}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Task title *</Text>
      <TextInput
        value={form.title}
        onChangeText={(v) => setForm((c) => ({ ...c, title: v }))}
        placeholder="What needs to get done?"
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        maxLength={120}
        returnKeyType="next"
      />

      <Text style={styles.label}>Details (optional)</Text>
      <TextInput
        value={form.description}
        onChangeText={(v) => setForm((c) => ({ ...c, description: v }))}
        placeholder="Add a few helpful details…"
        placeholderTextColor={COLORS.textSecondary}
        style={[styles.input, styles.descriptionInput]}
        multiline
        maxLength={1000}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {['Low', 'Medium', 'High'].map((p) => (
          <Pressable
            key={p}
            onPress={() => setForm((c) => ({ ...c, priority: p }))}
            style={[
              styles.priorityBtn,
              form.priority === p && styles.priorityBtnActive,
            ]}
          >
            <Text
              style={[
                styles.priorityBtnText,
                form.priority === p && styles.priorityBtnTextActive,
              ]}
            >
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Due date (optional)</Text>
      <TextInput
        value={form.dueDate}
        onChangeText={(v) => setForm((c) => ({ ...c, dueDate: v }))}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        maxLength={10}
        autoCapitalize="none"
      />

      {!!error && (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Pressable
        onPress={handleSave}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && styles.pressed,
          isSubmitting && styles.disabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.saveBtnText}>
            {isEditing ? 'Save changes' : 'Save task'}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 19,
    padding: 16,
    marginBottom: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heading: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 84,
    paddingTop: 13,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  priorityBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  priorityBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  priorityBtnTextActive: {
    color: COLORS.primary,
  },
  errorWrap: {
    backgroundColor: COLORS.errorBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  saveBtn: {
    minHeight: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
