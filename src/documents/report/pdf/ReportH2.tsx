import { colors, fonts } from "@papelada-estagio/components/pdf";
import { StyleSheet, Text } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  h2: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.subheaderBlue,
    marginTop: 10,
    marginBottom: 6,
  },
});

export const reportH2Style = styles.h2;

interface ReportH2Props {
  children: ReactNode;
}

export function ReportH2({ children }: ReportH2Props) {
  return <Text style={styles.h2}>{children}</Text>;
}
