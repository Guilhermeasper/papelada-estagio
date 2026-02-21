import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  signatureLine: {
    marginLeft: 35,
    marginBottom: 3,
  },
  signatureLabel: {
    fontFamily: fonts.bold,
  },
  signatureSubLabel: {
    marginLeft: 35,
    fontSize: 9,
    marginBottom: 15,
  },
  centered: {
    textAlign: "center",
    marginLeft: 0,
  },
});

interface PDFSignatureLineProps {
  label: string;
  line?: string;
  subLabel?: string;
  style?: Style;
  centered?: boolean;
}

export function PDFSignatureLine({
  label,
  line = "___________________________________________",
  subLabel,
  style,
  centered = false,
}: PDFSignatureLineProps) {
  const containerStyle = [styles.container, style].filter(Boolean) as Style[];
  const lineStyle = [styles.signatureLine, centered ? styles.centered : {}]
    .filter(Boolean)
    .flat() as Style[];
  const subLabelStyle = [
    styles.signatureSubLabel,
    centered ? styles.centered : {},
  ]
    .filter(Boolean)
    .flat() as Style[];

  return (
    <View style={containerStyle}>
      <Text style={lineStyle}>
        <Text style={styles.signatureLabel}>{label} </Text>
        {line}
      </Text>
      {subLabel && <Text style={subLabelStyle}>{subLabel}</Text>}
    </View>
  );
}
