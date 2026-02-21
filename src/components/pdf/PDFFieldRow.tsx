import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 2,
    marginLeft: 35,
    flexWrap: "wrap",
  },
  label: {
    fontFamily: fonts.bold,
  },
  value: {
    fontWeight: 400,
    flex: 1,
  },
});

interface PDFFieldRowProps {
  label: string;
  value: string;
  marginLeft?: number;
  style?: Style;
  labelStyle?: Style;
  valueStyle?: Style;
}

export function PDFFieldRow({
  label,
  value,
  marginLeft,
  style,
  labelStyle,
  valueStyle,
}: PDFFieldRowProps) {
  const rowStyle = [
    styles.row,
    marginLeft !== undefined ? { marginLeft } : {},
    style,
  ].filter(Boolean) as Style[];

  return (
    <View style={rowStyle}>
      <Text style={[styles.label, labelStyle].filter(Boolean) as Style[]}>
        {label}:{" "}
      </Text>
      <Text style={[styles.value, valueStyle].filter(Boolean) as Style[]}>
        {value}
      </Text>
    </View>
  );
}
