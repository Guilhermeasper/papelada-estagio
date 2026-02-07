/**
 * PDFSection - Numbered section wrapper with title
 */

import { StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import type { ReactNode } from 'react';
import { fonts } from './styles';

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 10,
    fontFamily: fonts.bold,
  },
});

interface PDFSectionProps {
  number?: number | string;
  title: string;
  children?: ReactNode;
  style?: Style;
}

export function PDFSection({ number, title, children, style }: PDFSectionProps) {
  const titleText = number ? `${number}. ${title}` : title;
  const containerStyle = style ? [styles.container, style] : styles.container;
  
  return (
    <View style={containerStyle}>
      <Text style={styles.title}>{titleText}</Text>
      {children}
    </View>
  );
}
