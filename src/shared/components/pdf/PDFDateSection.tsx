/**
 * PDFDateSection - Centered date section container
 */

import { StyleSheet, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  dateSection: {
    marginTop: 40,
    alignItems: 'center',
  },
});

interface PDFDateSectionProps {
  children: ReactNode;
}

export function PDFDateSection({ children }: PDFDateSectionProps) {
  return <View style={styles.dateSection}>{children}</View>;
}
