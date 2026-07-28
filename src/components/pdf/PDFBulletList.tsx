import { StyleSheet, Text, View } from "@react-pdf/renderer";

const MARKER_WIDTH = 18;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  item: {
    marginBottom: 8,
    marginLeft: 36,
    paddingLeft: MARKER_WIDTH,
    paddingRight: 20,
    textIndent: -MARKER_WIDTH,
    textAlign: "justify",
  },
});

interface PDFBulletListProps {
  items: string[];
  marginLeft?: number;
}

export function PDFBulletList({ items, marginLeft }: PDFBulletListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Text
          key={index}
          style={[styles.item, marginLeft !== undefined ? { marginLeft } : {}]}
        >
          {`•\u00a0\u00a0${item}`}
        </Text>
      ))}
    </View>
  );
}
