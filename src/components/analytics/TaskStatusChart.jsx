import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import COLORS from '../../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 184;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 85;
const INNER_RADIUS = 56;
const RING_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;
const RING_WIDTH = OUTER_RADIUS - INNER_RADIUS;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function AnimatedDonut({ data, total, isActive }) {
  const [progressValues] = useState(() => ({
    'To do': new Animated.Value(0),
    'Saved for later': new Animated.Value(0),
    Completed: new Animated.Value(0),
  }));

  const dataSignature = data
    .map((item) => `${item.label}:${item.value}`)
    .join('|');

  useEffect(() => {
    const values = Object.values(progressValues);

    values.forEach((value) => {
      value.stopAnimation();
      value.setValue(0);
    });

    if (!isActive || total === 0) {
      return undefined;
    }

    const animations = values.map((value) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );

    const animation = Animated.stagger(140, animations);
    animation.start();

    return () => animation.stop();
  }, [isActive, dataSignature, total, progressValues]);

  const slices = data.map((item, index) => {
    const precedingValue = data
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.value, 0);

    const startAngle =
      total > 0
        ? -90 + (precedingValue / total) * 360
        : -90;

    const arcLength =
      total > 0
        ? (item.value / total) * CIRCUMFERENCE
        : 0;

    const progress = progressValues[item.label];

    const dashOffset = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [arcLength, 0],
    });

    return {
      ...item,
      startAngle,
      arcLength,
      dashOffset,
    };
  });

  return (
    <View style={styles.donut}>
      <Svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke={COLORS.background}
          strokeWidth={RING_WIDTH}
        />

        {slices.map((slice) => (
          <AnimatedCircle
            key={slice.label}
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke={slice.color}
            strokeWidth={RING_WIDTH}
            strokeLinecap="butt"
            strokeDasharray={`${slice.arcLength} ${CIRCUMFERENCE}`}
            strokeDashoffset={slice.dashOffset}
            rotation={slice.startAngle}
            origin={`${CENTER}, ${CENTER}`}
          />
        ))}
      </Svg>
      <View pointerEvents="none" style={styles.donutCenter}>
        <Text style={styles.donutTotal}>{total}</Text>
        <Text style={styles.donutCaption}>Tasks</Text>
      </View>
    </View>
  );
}


export default function TaskStatusChart({
  todoCount = 0,
  savedCount = 0,
  completedCount = 0,
  totalTasks = 0,
  completionRate = 0,
  isActive = false,
}) {
  const statusRows = [
    { label: 'To do', value: todoCount, color: COLORS.primary },
    {
      label: 'Saved for later',
      value: savedCount,
      color: COLORS.softAmber,
    },
    {
      label: 'Completed',
      value: completedCount,
      color: COLORS.sage,
    },
  ];

  const pieData = statusRows.filter((item) => item.value > 0);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Task status</Text>
        <Text style={styles.cardSubtitle}>
          Where your tasks stand right now
        </Text>
      </View>

      <View style={styles.statusContent}>
        {totalTasks > 0 ? (
          <AnimatedDonut
            data={pieData}
            total={totalTasks}
            isActive={isActive}
          />
        ) : (
          <View style={styles.emptyDonut}>
            <Text style={styles.donutTotal}>0</Text>
            <Text style={styles.donutCaption}>Tasks</Text>
          </View>
        )}

        <View style={styles.legend}>
          {statusRows.map((item) => {
            const percentage = totalTasks
              ? Math.round((item.value / totalTasks) * 100)
              : 0;

            return (
              <View key={item.label} style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: item.color },
                  ]}
                />

                <View style={styles.legendTextGroup}>
                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={styles.legendPercentage}>
                    {percentage}%
                  </Text>
                </View>

                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressTitle}>Overall completion</Text>
          <Text style={styles.progressPercentage}>
            {completionRate}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${completionRate}%` },
            ]}
          />
        </View>

        <Text style={styles.progressCaption}>
          {completedCount} of {totalTasks} tasks completed
        </Text>
      </View>
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
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  donut: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTotal: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900',
  },
  donutCaption: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  emptyDonut: {
    width: SIZE,
    height: SIZE,
    borderWidth: 17,
    borderColor: COLORS.border,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flex: 1,
    minWidth: 0,
    gap: 15,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  legendLabel: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
  },
  legendPercentage: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  legendValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    minWidth: 15,
    textAlign: 'right',
  },
  progressSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  progressPercentage: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  progressCaption: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 7,
  },
});
