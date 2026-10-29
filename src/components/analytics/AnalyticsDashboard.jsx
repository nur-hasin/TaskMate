import { useIsFocused } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import COLORS from '../../theme/colors';
import PriorityBreakdownChart from './PriorityBreakdownChart';
import TaskStatusChart from './TaskStatusChart';

export default function AnalyticsDashboard({ tasks = [] }) {
  const isFocused = useIsFocused();
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const todoCount = safeTasks.filter(
    (task) => !task.completed && !task.savedForLater
  ).length;

  const savedCount = safeTasks.filter(
    (task) => !task.completed && task.savedForLater
  ).length;

  const completedCount = safeTasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = safeTasks.length;

  const completionRate = totalTasks
    ? Math.round((completedCount / totalTasks) * 100)
    : 0;

  let focusMessage;

  if (totalTasks === 0) {
    focusMessage = 'Create your first task to start tracking your progress.';
  } else if (todoCount > 0) {
    focusMessage = `${todoCount} ${todoCount === 1 ? 'task is' : 'tasks are'} ready for you to work on.`;
  } else if (savedCount > 0) {
    focusMessage = `You have ${savedCount} saved ${savedCount === 1 ? 'task' : 'tasks'} waiting for you.`;
  } else {
    focusMessage = 'All your tasks are completed. Nice work!';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Progress</Text>

      <View>
        <Text style={styles.sectionSubtitle}>{focusMessage}</Text>
      </View>

      <TaskStatusChart
        todoCount={todoCount}
        savedCount={savedCount}
        completedCount={completedCount}
        totalTasks={totalTasks}
        completionRate={completionRate}
        isActive={isFocused}
      />

      <PriorityBreakdownChart
        tasks={safeTasks}
        isActive={isFocused}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: -6,
  },
});
