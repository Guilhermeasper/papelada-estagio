

import { Page, StyleSheet } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { colors, fonts } from '../../../shared/components/pdf';

const styles = StyleSheet.create({
  coverPage: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
  },
});

interface ReportCoverPageProps {
  children: ReactNode;
}

export function ReportCoverPage({ children }: ReportCoverPageProps) {
  return (
    <Page size="A4" style={styles.coverPage}>
      {children}
    </Page>
  );
}
