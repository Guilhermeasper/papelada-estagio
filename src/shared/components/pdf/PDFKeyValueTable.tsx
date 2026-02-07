/**
 * PDFKeyValueTable - Table for displaying label-value pairs (identification sections)
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { colors } from './styles';

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textBlack,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 25,
  },
  rowLast: {
    flexDirection: 'row',
    minHeight: 25,
  },
  label: {
    width: 169,
    padding: 7,
    paddingTop: 12,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  value: {
    flex: 1,
    padding: 7,
    paddingTop: 12,
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
  const labelStyle = labelWidth 
    ? { ...styles.label, width: labelWidth }
    : styles.label;

  return (
    <View style={styles.table}>
      {items.map((item, index) => (
        <View
          key={index}
          style={index === items.length - 1 ? styles.rowLast : styles.row}
        >
          <View style={labelStyle}>
            <Text>{item.label}</Text>
          </View>
          <View style={styles.value}>
            <Text>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
