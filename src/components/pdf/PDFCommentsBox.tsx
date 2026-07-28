import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors } from "./styles";
import { splitTextIntoLines } from "./utils";

/** Borders sit on the rows — see the note in PDFTable. */
const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 15,
    marginTop: 10,
  },
  row: {
    minHeight: 25,
    padding: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.textBlack,
  },
  rowFirst: {
    borderTopWidth: 1,
  },
});

interface PDFCommentsBoxProps {
  text?: string;
  lines?: number;
  charsPerLine?: number;
}

export function PDFCommentsBox({
  text,
  lines = 10,
  charsPerLine = 84,
}: PDFCommentsBoxProps) {
  const textLines = splitTextIntoLines(text, lines, charsPerLine);

  return (
    <View style={styles.table}>
      {textLines.map((line, index) => (
        <View
          key={index}
          style={[styles.row, index === 0 ? styles.rowFirst : {}]}
          wrap={false}
        >
          <Text>{line}</Text>
        </View>
      ))}
    </View>
  );
}
