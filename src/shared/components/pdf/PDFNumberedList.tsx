/**
 * PDFNumberedList - Numbered list component
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 60,
    paddingRight: 20,
  },
  number: {
    width: 18,
  },
  text: {
    flex: 1,
    textAlign: 'justify',
  },
});

interface PDFNumberedListProps {
  items: string[];
  marginLeft?: number;
  startIndex?: number;
}

export function PDFNumberedList({ items, marginLeft, startIndex = 1 }: PDFNumberedListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={[styles.item, marginLeft !== undefined ? { marginLeft } : {}]}>
          <Text style={styles.number}>{startIndex + index}.</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
