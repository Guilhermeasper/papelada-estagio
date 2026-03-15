import { StyleSheet, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    breakInside: "avoid",
  },
});

interface PDFSignatureSectionProps {
  children: ReactNode;
  style?: Style;
}

export function PDFSignatureSection({
  children,
  style,
}: PDFSignatureSectionProps) {
  const containerStyle = [styles.container, style].filter(Boolean) as Style[];

  return <View style={containerStyle}>{children}</View>;
}
