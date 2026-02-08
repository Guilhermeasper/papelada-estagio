import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 3,
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
}

export function PDFFieldRow({ label, value, marginLeft }: PDFFieldRowProps) {
  return (
    <View style={[styles.row, marginLeft !== undefined ? { marginLeft } : {}]}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
