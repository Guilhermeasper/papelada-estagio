

import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 60,
    paddingRight: 20,
  },
  scheduleNumber: {
    width: 18,
  },
  scheduleContent: {
    flex: 1,
    textAlign: 'justify',
  },
});

interface ActivityPlanScheduleItemProps {
  number: number;
  period: string;
  description: string;
}

export function ActivityPlanScheduleItem({ number, period, description }: ActivityPlanScheduleItemProps) {
  return (
    <View style={styles.scheduleItem}>
      <Text style={styles.scheduleNumber}>{number}.</Text>
      <Text style={styles.scheduleContent}>
        {period} – {description}
      </Text>
    </View>
  );
}
