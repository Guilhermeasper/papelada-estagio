

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  evaluationIndent: {
    marginLeft: 70,
    marginBottom: 2,
  },
});

interface ActivityPlanEvaluationIndentProps {
  children: ReactNode;
}

export function ActivityPlanEvaluationIndent({ children }: ActivityPlanEvaluationIndentProps) {
  return <Text style={styles.evaluationIndent}>{children}</Text>;
}
