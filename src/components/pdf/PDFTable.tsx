import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, fonts } from "./styles";

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.textBlack,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
  },
  rowLast: {
    flexDirection: "row",
  },
  headerCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  headerCellLast: {
    padding: 5,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    textAlign: "center",
  },
  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  cellLast: {
    padding: 5,
  },
  cellText: {
    fontFamily: fonts.regular,
    fontSize: 10.5,
  },
  cellTextBold: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
  },
});

export interface ColumnConfig {
  key: string;
  header: string;
  width: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
}

interface PDFTableProps {
  columns: ColumnConfig[];
  rows: Record<string, string | number>[];
  marginLeft?: number;
}

export function PDFTable({ columns, rows, marginLeft }: PDFTableProps) {
  return (
    <View style={[styles.table, marginLeft ? { marginLeft } : {}]}>
      <View style={styles.row}>
        {columns.map((col, index) => (
          <View
            key={col.key}
            style={[
              index === columns.length - 1
                ? styles.headerCellLast
                : styles.headerCell,
              { width: col.width },
            ]}
          >
            <Text style={styles.headerText}>{col.header}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={rowIndex === rows.length - 1 ? styles.rowLast : styles.row}
        >
          {columns.map((col, colIndex) => (
            <View
              key={col.key}
              style={[
                colIndex === columns.length - 1 ? styles.cellLast : styles.cell,
                { width: col.width },
                col.align ? { textAlign: col.align } : {},
              ]}
            >
              <Text style={col.bold ? styles.cellTextBold : styles.cellText}>
                {row[col.key] ?? ""}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
