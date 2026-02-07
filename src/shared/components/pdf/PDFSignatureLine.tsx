/**
 * PDFSignatureLine - Single signature line component
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    textAlign: 'center',
  },
  line: {
    fontSize: 11,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
});

interface PDFSignatureLineProps {
  label: string;
  subLabel?: string;
  lineWidth?: number;
}

export function PDFSignatureLine({ label, subLabel, lineWidth = 40 }: PDFSignatureLineProps) {
  const line = '_'.repeat(lineWidth);
  
  return (
    <View style={styles.container}>
      <Text style={styles.line}>{line}</Text>
      <Text style={styles.label}>{label}</Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
    </View>
  );
}
