import { useEffect, useMemo, useState } from 'react';
import {
    LayoutAnimation,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../../components/AppHeader';
import EmptyState from '../../components/EmptyState';
import LoadingView from '../../components/LoadingView';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import useTasks from '../../hooks/useTasks';
import COLORS from '../../theme/colors';

function animateScreenLayout() {
    LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
    );
}

export default function TasksScreen() {
    const {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        toggleTask,
        toggleSavedForLater,
        confirmDeleteTask,
        completedCount,
    } = useTasks();

    const [taskFilter, setTaskFilter] = useState('todo');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        if (!notice) return;

        const timer = setTimeout(() => {
            setNotice(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notice]);

    const todoTasks = useMemo(
        () =>
            tasks.filter(
                (task) => !task.completed && !task.savedForLater
            ),
        [tasks]
    );

    const savedTasks = useMemo(
        () =>
            tasks.filter(
                (task) => !task.completed && task.savedForLater
            ),
        [tasks]
    );

    const visibleTasks =
        taskFilter === 'saved' ? savedTasks : todoTasks;

    if (loading) {
        return <LoadingView message="Loading tasks…" />;
    }

    function startNewTask() {
        animateScreenLayout();
        setTaskFilter('todo');
        setEditingTask(null);
        setShowForm(true);
        setNotice(null);
    }

    function startEditTask(task) {
        if (task.completed || task.savedForLater) return;

        animateScreenLayout();
        setEditingTask(task);
        setShowForm(true);
        setNotice(null);
    }

    function cancelForm() {
        animateScreenLayout();
        setShowForm(false);
        setEditingTask(null);
    }

    async function handleSave(values) {
        setIsSubmitting(true);
        setNotice(null);

        try {
            if (editingTask) {
                await updateTask(editingTask.id, {
                    ...values,
                    completed: editingTask.completed,
                });

                setNotice({
                    type: 'success',
                    text: 'Task updated.',
                });
            } else {
                await createTask({
                    ...values,
                    completed: false,
                    savedForLater: false,
                });

                setNotice({
                    type: 'success',
                    text: 'Task added to your To do list.',
                });
            }

            animateScreenLayout();
            setShowForm(false);
            setEditingTask(null);
        } catch (err) {
            setNotice({
                type: 'error',
                text: err.message || 'Something went wrong.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleToggle(task) {
        try {
            await toggleTask(task);
        } catch (err) {
            setNotice({
                type: 'error',
                text: err.message || 'Could not update task.',
            });
        }
    }

    async function handleToggleSavedForLater(task) {
        try {
            await toggleSavedForLater(task);

            setNotice({
                type: 'success',
                text: task.savedForLater
                    ? 'Task returned to To do.'
                    : 'Task saved for later.',
            });
        } catch (err) {
            setNotice({
                type: 'error',
                text: err.message || 'Could not update bookmark.',
            });
        }
    }

    function handleDelete(task) {
        if (task.completed || task.savedForLater) return;

        confirmDeleteTask(task);
    }

    function changeFilter(filter) {
        if (showForm) return;

        setNotice(null);
        setTaskFilter(filter);
    }

    return (
        <SafeAreaView
            style={styles.safe}
            edges={['top', 'left', 'right']}
        >
            <StatusBar barStyle="dark-content" />

            <AppHeader />

            {!!notice && (
                <View
                    style={[
                        styles.notice,
                        notice.type === 'error'
                            ? styles.errorNotice
                            : styles.successNotice,
                    ]}
                >
                    <Text
                        style={[
                            styles.noticeText,
                            notice.type === 'error'
                                ? styles.errorText
                                : styles.successText,
                        ]}
                    >
                        {notice.text}
                    </Text>
                </View>
            )}

            {!!error && (
                <View style={[styles.notice, styles.errorNotice]}>
                    <Text style={[styles.noticeText, styles.errorText]}>
                        {error}
                    </Text>
                </View>
            )}

            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Task overview */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Task Overview</Text>

                    <View style={styles.summaryStats}>
                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>
                                {todoTasks.length}
                            </Text>
                            <Text style={styles.statLabel}>To do</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>
                                {savedTasks.length}
                            </Text>
                            <Text style={styles.statLabel}>Saved</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>
                                {completedCount}
                            </Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </View>
                </View>

                {/* Section heading */}
                <View style={styles.sectionRow}>
                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>My tasks</Text>

                        <Text style={styles.sectionSubtitle}>
                            {taskFilter === 'saved'
                                ? `${savedTasks.length} saved ${savedTasks.length === 1 ? 'task' : 'tasks'
                                }`
                                : `${todoTasks.length} ${todoTasks.length === 1 ? 'task' : 'tasks'
                                } waiting for you`}
                        </Text>
                    </View>

                    <Pressable
                        onPress={startNewTask}
                        style={({ pressed }) => [
                            styles.addBtn,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.addBtnText}>＋ Add task</Text>
                    </Pressable>
                </View>

                {/* To do / Saved for later filters */}
                <View style={styles.filterRow}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{
                            selected: taskFilter === 'todo',
                            disabled: showForm,
                        }}
                        disabled={showForm}
                        onPress={() => changeFilter('todo')}
                        style={[
                            styles.filterButton,
                            taskFilter === 'todo' && styles.filterButtonActive,
                            showForm && styles.filterDisabled,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                taskFilter === 'todo' && styles.filterTextActive,
                            ]}
                        >
                            To do ({todoTasks.length})
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{
                            selected: taskFilter === 'saved',
                            disabled: showForm,
                        }}
                        disabled={showForm}
                        onPress={() => changeFilter('saved')}
                        style={[
                            styles.filterButton,
                            taskFilter === 'saved' && styles.filterButtonActive,
                            showForm && styles.filterDisabled,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                taskFilter === 'saved' && styles.filterTextActive,
                            ]}
                        >
                            Saved for later ({savedTasks.length})
                        </Text>
                    </Pressable>
                </View>

                {/* Task form */}
                {showForm && (
                    <TaskForm
                        initialValues={
                            editingTask
                                ? {
                                    title: editingTask.title,
                                    description: editingTask.description || '',
                                    priority: editingTask.priority || 'Medium',
                                    dueDate: editingTask.dueDate || '',
                                }
                                : undefined
                        }
                        isEditing={!!editingTask}
                        isSubmitting={isSubmitting}
                        onSave={handleSave}
                        onCancel={cancelForm}
                    />
                )}

                {/* Filtered task list */}
                {!showForm && visibleTasks.length === 0 ? (
                    taskFilter === 'todo' && tasks.length === 0 ? (
                        <EmptyState
                            actionLabel="Create your first task"
                            onAction={startNewTask}
                        />
                    ) : (
                        <View style={styles.emptyPanel}>
                            <Text style={styles.emptyTitle}>
                                {taskFilter === 'saved'
                                    ? 'No saved tasks yet'
                                    : 'No tasks to do'}
                            </Text>

                            <Text style={styles.emptyDescription}>
                                {taskFilter === 'saved'
                                    ? 'Bookmark a task to keep it here until you are ready to work on it.'
                                    : 'You have no tasks waiting in your To do list.'}
                            </Text>
                        </View>
                    )
                ) : (
                    visibleTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={startEditTask}
                            onDelete={handleDelete}
                            onToggleSavedForLater={handleToggleSavedForLater}
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 26,
    },
    notice: {
        marginHorizontal: 20,
        marginBottom: 9,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    successNotice: {
        backgroundColor: COLORS.successBg,
    },
    errorNotice: {
        backgroundColor: COLORS.errorBg,
    },
    noticeText: {
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '600',
    },
    successText: {
        color: COLORS.success,
    },
    errorText: {
        color: COLORS.error,
    },
    summaryCard: {
        borderRadius: 22,
        padding: 20,
        backgroundColor: COLORS.secondaryLight,
        marginBottom: 27,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: '700',
        marginTop: 7,
    },
    summaryStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 23,
    },
    statBlock: {
        flex: 1,
    },
    statNumber: {
        color: COLORS.text,
        fontSize: 25,
        fontWeight: '800',
    },
    statLabel: {
        color: COLORS.accent,
        fontSize: 11,
        marginTop: 3,
        fontWeight: '600',
    },
    statDivider: {
        height: 33,
        width: 1,
        backgroundColor: COLORS.softAmber,
        marginHorizontal: 10,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    sectionHeading: {
        flex: 1,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 4,
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderRadius: 12,
    },
    addBtnText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '800',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 15,
    },
    filterButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    filterButtonActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center',
    },
    filterTextActive: {
        color: COLORS.primary,
    },
    filterDisabled: {
        opacity: 0.55,
    },
    emptyPanel: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 22,
        alignItems: 'center',
        marginTop: 4,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
    },
    emptyDescription: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        marginTop: 8,
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
    },
});