/**
 * ActivityPlanSignatureLine - Signature line with label and optional sub-label
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import { fonts } from '../../../shared/components/pdf';

const styles = StyleSheet.create({
  signatureLine: {
    marginLeft: 35,
    marginBottom: 3,
  },
  signatureLabel: {
    fontFamily: fonts.bold,
  },
  signatureSubLabel: {
    marginLeft: 35,
    fontSize: 9,
    marginBottom: 15,
  },
});

interface ActivityPlanSignatureLineProps {
  label: string;
  line?: string;
  subLabel?: string;
  style?: Style;
}

export function ActivityPlanSignatureLine({ 
  label, 
  line = '___________________________________________',
  subLabel,
  style,
}: ActivityPlanSignatureLineProps) {
  return (
    <View>
      <Text style={[styles.signatureLine, style ?? {}]}>
        <Text style={styles.signatureLabel}>{label} </Text>
        {line}
      </Text>
      {subLabel && (
        <Text style={styles.signatureSubLabel}>{subLabel}</Text>
      )}
    </View>
  );
}
