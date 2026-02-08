

import { StyleSheet, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  coverFooter: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 100,
  },
});

interface ReportCoverFooterProps {
  children: ReactNode;
}

export function ReportCoverFooter({ children }: ReportCoverFooterProps) {
  return <View style={styles.coverFooter}>{children}</View>;
}
