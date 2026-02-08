import { fonts } from "@papelada-estagio/components/pdf";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingTop: 6,
  },
  tocItemText: {
    fontFamily: fonts.serifBold,
    fontSize: 12,
  },
});

interface ReportTocItemProps {
  label: string;
  page: number;
}

export function ReportTocItem({ label, page }: ReportTocItemProps) {
  return (
    <View style={styles.tocItem}>
      <Text style={styles.tocItemText}>{label}</Text>
      <Text style={styles.tocItemText}>{page}</Text>
    </View>
  );
}
