import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { fonts } from "../../../components/pdf";

const styles = StyleSheet.create({
  tocSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    marginLeft: 12,
  },
  tocSubItemText: {
    fontFamily: fonts.serifBold,
    fontSize: 11,
  },
});

interface ReportTocSubItemProps {
  label: string;
  page: number;
}

export function ReportTocSubItem({ label, page }: ReportTocSubItemProps) {
  return (
    <View style={styles.tocSubItem}>
      <Text style={styles.tocSubItemText}>{label}</Text>
      <Text style={styles.tocSubItemText}>{page}</Text>
    </View>
  );
}
