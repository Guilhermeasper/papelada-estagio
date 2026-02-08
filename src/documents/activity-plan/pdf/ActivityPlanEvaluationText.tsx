import { StyleSheet, Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  evaluationText: {
    marginLeft: 35,
    marginBottom: 4,
    textAlign: "justify",
  },
});

interface ActivityPlanEvaluationTextProps {
  children: ReactNode;
  style?: Style;
}

export function ActivityPlanEvaluationText({
  children,
  style,
}: ActivityPlanEvaluationTextProps) {
  return (
    <Text
      style={style ? [styles.evaluationText, style] : styles.evaluationText}
    >
      {children}
    </Text>
  );
}
