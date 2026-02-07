/**
 * PDFSignatureBlock - Multi-signature block with date
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { fonts } from './styles';

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  date: {
    textAlign: 'center',
    marginBottom: 15,
  },
  signatureRow: {
    marginTop: 20,
    marginLeft: 35,
  },
  inlineLabel: {
    fontFamily: fonts.bold,
  },
  subLabel: {
    marginLeft: 35,
    fontSize: 9,
    marginBottom: 15,
  },
});

export interface SignatureConfig {
  label: string;
  subLabel?: string;
  name?: string;
}

interface PDFSignatureBlockProps {
  date?: string;
  datePrefix?: string;
  signaturesLabel?: string;
  signatures: SignatureConfig[];
}

export function PDFSignatureBlock({ 
  date, 
  datePrefix = 'Recife, ',
  signaturesLabel = 'Assinaturas:',
  signatures 
}: PDFSignatureBlockProps) {
  return (
    <View style={styles.container}>
      {date && (
        <Text style={styles.date}>
          {datePrefix}{date}
        </Text>
      )}
      
      {signaturesLabel && (
        <Text style={[styles.signatureRow, { marginLeft: 0 }]}>
          <Text style={styles.inlineLabel}>{signaturesLabel}</Text>
        </Text>
      )}

      {signatures.map((sig, index) => (
        <View key={index}>
          <Text style={styles.signatureRow}>
            <Text style={styles.inlineLabel}>{sig.label}: </Text>
            ___________________________________________
          </Text>
          {sig.subLabel && (
            <Text style={styles.subLabel}>
              {sig.subLabel}
              {sig.name ? `                        (${sig.name})` : ''}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
