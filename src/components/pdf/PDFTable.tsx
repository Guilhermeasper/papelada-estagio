import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, fonts } from "./styles";

/**
 * Borders live on the cells rather than on the table container: a bordered
 * container that gets split across pages is stretched to the full remaining
 * page height by react-pdf, leaving an empty boxed stub behind.
 */
const styles = StyleSheet.create({
  table: {
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.textBlack,
  },
  cellLastColumn: {
    borderRightWidth: 1,
  },
  cellHeader: {
    borderTopWidth: 1,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    textAlign: "center",
  },
  cellText: {
    fontFamily: fonts.regular,
    fontSize: 10,
  },
  cellTextBold: {
    fontFamily: fonts.bold,
    fontSize: 10,
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
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const cellStyle = (colIndex: number, isHeader: boolean) => [
    styles.cell,
    { width: columns[colIndex].width },
    colIndex === columns.length - 1 ? styles.cellLastColumn : {},
    isHeader ? styles.cellHeader : {},
  ];

  return (
    <View
      style={[
        styles.table,
        { width: tableWidth },
        marginLeft ? { marginLeft } : {},
      ]}
    >
      <View style={styles.row} wrap={false}>
        {columns.map((col, index) => (
          <View key={col.key} style={cellStyle(index, true)}>
            <Text style={styles.headerText}>{col.header}</Text>
          </View>
        ))}
      </View>

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row} wrap={false}>
          {columns.map((col, colIndex) => (
            <View key={col.key} style={cellStyle(colIndex, false)}>
              <Text
                style={[
                  col.bold ? styles.cellTextBold : styles.cellText,
                  { textAlign: col.align ?? "left" },
                ]}
              >
                {row[col.key] ?? ""}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
