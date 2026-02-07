/**
 * PDFTextHeader - Simple centered text header for documents
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { fonts } from './styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 20,
  },
});

interface PDFTextHeaderProps {
  subtitle?: string;
  title: string;
}

export function PDFTextHeader({ subtitle, title }: PDFTextHeaderProps) {
  return (
    <View style={styles.container}>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
