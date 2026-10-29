import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';

export default function PriorityBadge({ priority = 'Medium' }) {
  const bg =
    priority === 'High'
      ? COLORS.highPriorityBg
      : priority === 'Low'
        ? COLORS.lowPriorityBg
        : COLORS.mediumPriorityBg;

  const fg =
    priority === 'High'
      ? COLORS.highPriorityText
      : priority === 'Low'
        ? COLORS.lowPriorityText
        : COLORS.mediumPriorityText;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>
        {priority} priority
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
  },
});
