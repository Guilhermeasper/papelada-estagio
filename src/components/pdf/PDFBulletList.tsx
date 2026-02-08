import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    marginBottom: 8,
    marginLeft: 36,
    paddingRight: 20,
  },
  bullet: {
    width: 18,
  },
  text: {
    flex: 1,
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
        <View
          key={index}
          style={[styles.item, marginLeft !== undefined ? { marginLeft } : {}]}
        >
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
