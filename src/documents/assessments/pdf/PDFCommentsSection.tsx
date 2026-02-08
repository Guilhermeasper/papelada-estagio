import { StyleSheet, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  commentsSection: {
    marginTop: 20,
  },
});

interface PDFCommentsSectionProps {
  children: ReactNode;
}

export function PDFCommentsSection({ children }: PDFCommentsSectionProps) {
  return <View style={styles.commentsSection}>{children}</View>;
}
