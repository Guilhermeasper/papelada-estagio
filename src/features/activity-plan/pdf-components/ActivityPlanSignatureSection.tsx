/**
 * ActivityPlanSignatureSection - Container for signature block
 */

import { StyleSheet, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';

const styles = StyleSheet.create({
  signatureSection: {
    marginTop: 30,
  },
});

interface ActivityPlanSignatureSectionProps {
  children: ReactNode;
}

export function ActivityPlanSignatureSection({ children }: ActivityPlanSignatureSectionProps) {
  return <View style={styles.signatureSection}>{children}</View>;
}
