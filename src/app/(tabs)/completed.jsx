import { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import TaskCard from '../../components/TaskCard';
import useTasks from '../../hooks/useTasks';
import COLORS from '../../theme/colors';
import EmptyState from '../../components/EmptyState';

export default function CompletedScreen() {
    const {
        tasks,
        loading,
        error,
        toggleTask,
        confirmDeleteTask,
    } = useTasks();

    const [notice, setNotice] = useState(null);

    const completedTasks = useMemo(
        () => tasks.filter((task) => task.completed),
        [tasks]
    );

    const completedCount = completedTasks.length;
    const pendingCount = tasks.length - completedCount;

    useEffect(() => {
        if (!notice) return;

        const timer = setTimeout(() => {
            setNotice(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notice]);

    async function handleToggle(task) {
        try {
            await toggleTask(task);
            setNotice({ type: 'success', text: 'Task reopened.' });
        } catch (err) {
            setNotice({
                type: 'error',
                text: err.message || 'Could not update task.',
            });
        }
    }

    if (loading) {
        return <LoadingView message="Loading tasks…" />;
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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
                {/* Shared Task Overview */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Task Overview</Text>

                    <View style={styles.summaryStats}>
                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>{pendingCount}</Text>
                            <Text style={styles.statLabel}>To do</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>{completedCount}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>{tasks.length}</Text>
                            <Text style={styles.statLabel}>All tasks</Text>
                        </View>
                    </View>
                </View>

                {/* Completed tasks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Completed tasks</Text>
                    <Text style={styles.sectionSubtitle}>
                        {completedCount}{' '}
                        {completedCount === 1 ? 'task' : 'tasks'} completed
                    </Text>
                </View>

                {completedTasks.length === 0 ? (
                    <EmptyState
  icon="✓"
  title="Your wins will show up here."
/>
                ) : (
                    completedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onDelete={confirmDeleteTask}
                            showEdit={false}
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
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },
    successNotice: {
        backgroundColor: COLORS.successBg,
    },
    errorNotice: {
        backgroundColor: COLORS.errorBg,
    },
    noticeText: {
        fontSize: 13,
        lineHeight: 18,
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

    section: {
        marginBottom: 18,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 23,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        color: COLORS.textSecondary,
        fontSize: 13,
        marginTop: 5,
    },

    emptyCard: {
        minHeight: 190,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    emptyIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
    },
});