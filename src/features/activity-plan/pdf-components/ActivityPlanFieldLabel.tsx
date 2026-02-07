/**
 * ActivityPlanFieldLabel - Bold field label
 */

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import type { ReactNode } from 'react';
import { fonts } from '../../../shared/components/pdf';

const styles = StyleSheet.create({
  fieldLabel: {
    fontFamily: fonts.bold,
  },
});

interface ActivityPlanFieldLabelProps {
  children: ReactNode;
  style?: Style;
}

export function ActivityPlanFieldLabel({ children, style }: ActivityPlanFieldLabelProps) {
  return <Text style={[styles.fieldLabel, style ?? {}]}>{children}</Text>;
}
