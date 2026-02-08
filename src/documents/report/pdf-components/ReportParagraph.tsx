

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 1.3,
  },
});

interface ReportParagraphProps {
  children: ReactNode;
}

export function ReportParagraph({ children }: ReportParagraphProps) {
  return <Text style={styles.paragraph}>{children}</Text>;
}
