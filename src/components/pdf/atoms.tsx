
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { colors, fonts } from './styles';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textBlack,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginTop: 15,
    marginBottom: 10,
    color: colors.textBlack,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    fontFamily: fonts.regular,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginBottom: 8,
    color: colors.textBlack,
  },
  labelValueContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.bold,
    marginRight: 5,
    color: colors.textBlack,
  },
  value: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textBlack,
    flex: 1,
  },
});

interface TextProps {
  children: React.ReactNode;
  style?: any;
}

export const DocTitle = ({ children, style }: TextProps) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

export const DocSectionTitle = ({ children, style }: TextProps) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

export const DocText = ({ children, style }: TextProps) => (
  <Text style={[styles.text, style]}>{children}</Text>
);

interface DocLabelValueProps {
  label: string;
  value: string | number;
  style?: any;
}

export const DocLabelValue = ({ label, value, style }: DocLabelValueProps) => (
  <View style={[styles.labelValueContainer, style]}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);
