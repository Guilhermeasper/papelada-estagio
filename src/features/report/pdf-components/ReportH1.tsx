

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { colors, fonts } from '../../../components/pdf';

const styles = StyleSheet.create({
  h1: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.headerBlue,
    marginTop: 24,
    marginBottom: 10,
  },
});

export const reportH1Style = styles.h1;

interface ReportH1Props {
  children: ReactNode;
}

export function ReportH1({ children }: ReportH1Props) {
  return <Text style={styles.h1}>{children}</Text>;
}
