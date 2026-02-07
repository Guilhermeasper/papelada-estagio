/**
 * ReportPage - Report document page wrapper
 * Uses serif font with standard margins
 */

import { Page, StyleSheet } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { colors, fonts } from '../../../shared/components/pdf';

const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
    lineHeight: 1.2,
  },
});

interface ReportPageProps {
  children: ReactNode;
}

export function ReportPage({ children }: ReportPageProps) {
  return (
    <Page size="A4" style={styles.page}>
      {children}
    </Page>
  );
}
