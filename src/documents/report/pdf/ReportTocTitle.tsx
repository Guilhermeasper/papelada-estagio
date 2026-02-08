import { fonts } from "@papelada-estagio/components/pdf";
import { StyleSheet, Text } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  tocTitle: {
    fontSize: 16,
    fontFamily: fonts.serifBold,
    textAlign: "center",
    marginBottom: 20,
  },
});

interface ReportTocTitleProps {
  children: ReactNode;
}

export function ReportTocTitle({ children }: ReportTocTitleProps) {
  return <Text style={styles.tocTitle}>{children}</Text>;
}
