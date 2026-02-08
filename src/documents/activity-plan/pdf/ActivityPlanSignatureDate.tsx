import { StyleSheet, Text } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  signatureDate: {
    textAlign: "center",
    marginBottom: 15,
  },
});

interface ActivityPlanSignatureDateProps {
  children: ReactNode;
}

export function ActivityPlanSignatureDate({
  children,
}: ActivityPlanSignatureDateProps) {
  return <Text style={styles.signatureDate}>{children}</Text>;
}
