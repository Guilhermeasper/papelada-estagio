

import { StyleSheet, Text } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import type { ReactNode } from 'react';
import { fonts } from './styles';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 12,
    fontFamily: fonts.serif,
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 1.3,
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
});

interface PDFParagraphProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: Style;
}

export function PDFParagraph({ children, align = 'justify', style }: PDFParagraphProps) {
  const baseStyle = [styles.paragraph, styles[align]];
  const finalStyle = style ? [...baseStyle, style] : baseStyle;
  
  return (
    <Text style={finalStyle}>
      {children}
    </Text>
  );
}
