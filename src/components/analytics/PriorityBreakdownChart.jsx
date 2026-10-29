import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import COLORS from '../../theme/colors';

export default function PriorityBreakdownChart({
    tasks = [],
    isActive = false,
}) {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const priorityCounts = {
        Low: 0,
        Medium: 0,
        High: 0,
    };

    safeTasks.forEach((task) => {
        const priority = ['Low', 'Medium', 'High'].includes(task.priority)
            ? task.priority
            : 'Medium';

        priorityCounts[priority] += 1;
    });

    const totalTasks = safeTasks.length;

    const priorityRows = [
        { label: 'Low', value: priorityCounts.Low, color: COLORS.sage },
        {
            label: 'Medium',
            value: priorityCounts.Medium,
            color: COLORS.softAmber,
        },
        { label: 'High', value: priorityCounts.High, color: COLORS.primary },
    ];

    const largestBar = Math.max(
        priorityCounts.Low,
        priorityCounts.Medium,
        priorityCounts.High
    );

    const chartMaxValue = Math.max(
        4,
        Math.ceil(largestBar / 4) * 4
    );

    const mostCommonPriorities = ['Low', 'Medium', 'High'].filter(
        (priority) => priorityCounts[priority] === largestBar
    );

    let priorityInsight;

    if (totalTasks === 0) {
        priorityInsight = 'Create a task to start tracking your priorities.';
    } else if (mostCommonPriorities.length === 3) {
        priorityInsight = 'Your tasks are evenly distributed across priorities.';
    } else if (mostCommonPriorities.length === 1) {
        priorityInsight = `${mostCommonPriorities[0]} priority is your most common.`;
    } else {
        priorityInsight = `${mostCommonPriorities.join(' and ')} priorities are tied for the lead.`;
    }

    const chartData = priorityRows.map((item) => ({
        value: item.value,
        label: '',
        frontColor: item.color,
        disablePress: true,
    }));

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Priority breakdown</Text>
                <Text style={styles.cardSubtitle}>
                    All tasks grouped by priority
                </Text>
            </View>

            {totalTasks > 0 ? (
                <>
                    <View style={styles.chartContent}>
                        <View style={styles.barChartContainer}>
                            <BarChart
                                key={`${isActive}-${chartData.map((item) => item.value).join('-')}`}
                                data={chartData}
                                width={170}
                                disablePress
                                disableScroll
                                focusBarOnPress={false}
                                highlightEnabled={false}
                                height={185}
                                barWidth={32}
                                spacing={22}
                                initialSpacing={10}
                                endSpacing={4}
                                yAxisLabelWidth={20}
                                maxValue={chartMaxValue}
                                noOfSections={4}
                                stepValue={chartMaxValue / 4}
                                barBorderRadius={6}
                                showValuesAsTopLabel
                                topLabelTextStyle={styles.barTopLabel}
                                yAxisTextStyle={styles.barYAxisLabel}
                                xAxisColor={COLORS.border}
                                yAxisThickness={0}
                                rulesColor={COLORS.border}
                                rulesType="solid"
                                isAnimated
                                animationDuration={850}
                            />
                        </View>

                        {/* Right-side priority legend */}
                        <View style={styles.priorityLegend}>
                            {priorityRows.map((item) => (
                                <View key={item.label} style={styles.legendRow}>
                                    <View
                                        style={[
                                            styles.priorityDot,
                                            { backgroundColor: item.color },
                                        ]}
                                    />

                                    <View style={styles.legendTextGroup}>
                                        <Text style={styles.legendLabel}>{item.label}</Text>
                                    </View>

                                    <Text style={styles.legendValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.insightBox}>
                        <Text style={styles.insightLabel}>PRIORITY INSIGHT</Text>
                        <Text style={styles.insightText}>{priorityInsight}</Text>
                    </View>
                </>
            ) : (
                <View style={styles.emptyChart}>
                    <Text style={styles.emptyChartTitle}>No priority data yet</Text>
                    <Text style={styles.emptyChartText}>
                        Create a task to see your Low, Medium, and High priority distribution.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 19,
        padding: 15,
    },
    cardHeader: {
        marginBottom: 12,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    cardSubtitle: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 16,
        marginTop: 3,
    },
    chartContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 4,
    },
    barChartContainer: {
        width: 205,
        flexShrink: 0,
    },
    barTopLabel: {
        color: COLORS.text,
        fontSize: 10,
        fontWeight: '800',
    },
    barYAxisLabel: {
        color: COLORS.textSecondary,
        fontSize: 9,
    },
    priorityLegend: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center',
        gap: 20,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendTextGroup: {
        flex: 1,
        minWidth: 0,
    },
    legendLabel: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },
    legendValue: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '900',
        minWidth: 12,
        textAlign: 'right',
    },
    insightBox: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 12,
        marginTop: 13,
    },
    insightLabel: {
        color: COLORS.primary,
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    insightText: {
        color: COLORS.text,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
        marginTop: 5,
    },
    emptyChart: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 12,
    },
    emptyChartTitle: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: '800',
        textAlign: 'center',
    },
    emptyChartText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
        marginTop: 7,
    },
});
