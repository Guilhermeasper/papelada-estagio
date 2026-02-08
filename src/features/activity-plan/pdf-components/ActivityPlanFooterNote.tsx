

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { colors } from '../../../components/pdf';

const styles = StyleSheet.create({
  footerNote: {
    marginTop: 30,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: colors.textBlack,
    paddingTop: 8,
    textAlign: 'justify',
  },
});

interface ActivityPlanFooterNoteProps {
  children: ReactNode;
}

export function ActivityPlanFooterNote({ children }: ActivityPlanFooterNoteProps) {
  return <Text style={styles.footerNote}>{children}</Text>;
}
