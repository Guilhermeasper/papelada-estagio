import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors } from "./styles";

/** Borders sit on the cells — see the note in PDFTable. */
const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    minHeight: 25,
  },
  cell: {
    padding: 7,
    paddingTop: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.textBlack,
  },
  cellFirstRow: {
    borderTopWidth: 1,
  },
  label: {
    width: 169,
  },
  value: {
    flex: 1,
    borderRightWidth: 1,
  },
});

export interface KeyValueItem {
  label: string;
  value: string;
}

interface PDFKeyValueTableProps {
  items: KeyValueItem[];
  labelWidth?: number;
}

export function PDFKeyValueTable({ items, labelWidth }: PDFKeyValueTableProps) {
  return (
    <View style={styles.table}>
      {items.map((item, index) => {
        const firstRow = index === 0 ? styles.cellFirstRow : {};

        return (
          <View key={index} style={styles.row} wrap={false}>
            <View
              style={[
                styles.cell,
                styles.label,
                labelWidth ? { width: labelWidth } : {},
                firstRow,
              ]}
            >
              <Text>{item.label}</Text>
            </View>
            <View style={[styles.cell, styles.value, firstRow]}>
              <Text>{item.value}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
