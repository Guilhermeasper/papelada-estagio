import { StyleSheet, Text, View } from "@react-pdf/renderer";

const MARKER_WIDTH = 18;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  item: {
    marginBottom: 4,
    marginLeft: 60,
    paddingLeft: MARKER_WIDTH,
    paddingRight: 20,
    textIndent: -MARKER_WIDTH,
    textAlign: "justify",
  },
});

interface PDFNumberedListProps {
  items: string[];
  marginLeft?: number;
  startIndex?: number;
}

export function PDFNumberedList({
  items,
  marginLeft,
  startIndex = 1,
}: PDFNumberedListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Text
          key={index}
          style={[styles.item, marginLeft !== undefined ? { marginLeft } : {}]}
        >
          {`${startIndex + index}.\u00a0\u00a0${item}`}
        </Text>
      ))}
    </View>
  );
}
