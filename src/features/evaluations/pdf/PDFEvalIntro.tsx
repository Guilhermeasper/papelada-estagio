import { StyleSheet, Text } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  evalIntro: {
    fontSize: 11,
    marginBottom: 15,
  },
});

interface PDFEvalIntroProps {
  children: ReactNode;
}

export function PDFEvalIntro({ children }: PDFEvalIntroProps) {
  return <Text style={styles.evalIntro}>{children}</Text>;
}
