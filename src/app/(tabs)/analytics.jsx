
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import useTasks from '../../hooks/useTasks';
import COLORS from '../../theme/colors';

export default function AnalyticsScreen() {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <LoadingView message="Loading analytics…" />;
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="dark-content" />

      <AppHeader />

      {!!error && (
        <View style={styles.errorNotice}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnalyticsDashboard tasks={tasks} />
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
    paddingTop: 8,
    paddingBottom: 28,
  },
  errorNotice: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.errorBg,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
});
