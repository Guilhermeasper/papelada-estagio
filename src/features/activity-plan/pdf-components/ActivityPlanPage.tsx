

import { Page, StyleSheet } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { colors, fonts } from '../../../components/pdf';

const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 56,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textBlack,
    lineHeight: 1.0,
  },
});

interface ActivityPlanPageProps {
  children: ReactNode;
}

export function ActivityPlanPage({ children }: ActivityPlanPageProps) {
  return (
    <Page size="A4" style={styles.page} wrap>
      {children}
    </Page>
  );
}
