import { StyleSheet, Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  date: {
    fontFamily: fonts.regular,
    marginBottom: 10,
  },
});

interface PDFSignatureDateProps {
  children: string;
  style?: Style;
}

export function PDFSignatureDate({ children, style }: PDFSignatureDateProps) {
  const finalStyle = [styles.date, style].filter(Boolean) as Style[];
  return <Text style={finalStyle}>{children}</Text>;
}
