

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { colors } from './styles';
import { splitTextIntoLines } from './utils';

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textBlack,
    marginBottom: 15,
    marginTop: 10,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 25,
    padding: 5,
  },
  rowLast: {
    minHeight: 25,
    padding: 5,
  },
});

interface PDFCommentsBoxProps {
  text?: string;
  lines?: number;
  charsPerLine?: number;
}

export function PDFCommentsBox({ text, lines = 10, charsPerLine = 84 }: PDFCommentsBoxProps) {
  const textLines = splitTextIntoLines(text, lines, charsPerLine);

  return (
    <View style={styles.table}>
      {textLines.map((line, index) => (
        <View
          key={index}
          style={index === lines - 1 ? styles.rowLast : styles.row}
        >
          <Text>{line}</Text>
        </View>
      ))}
    </View>
  );
}
