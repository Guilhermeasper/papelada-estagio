/**
 * Shared PDF Styles
 * Common colors, fonts, and base styles for all PDF documents
 */

import { StyleSheet } from '@react-pdf/renderer';

// ============================================
// Colors
// ============================================
export const colors = {
  // Base
  textBlack: '#000000',
  white: '#FFFFFF',
  
  // CIn-UFPE Identity
  primaryRed: '#DB1E2F',
  borderGray: '#E0E1E0',
  
  // Report colors
  headerBlue: '#335b8a',
  subheaderBlue: '#4f81bd',
};

// ============================================
// Font Families
// ============================================
export const fonts = {
  regular: 'Helvetica',
  bold: 'Helvetica-Bold',
  serif: 'Times-Roman',
  serifBold: 'Times-Bold',
};

// ============================================
// Common Page Styles
// ============================================
export const pageStyles = StyleSheet.create({
  // Default page (Helvetica, standard margins)
  default: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textBlack,
    lineHeight: 1.2,
  },
  
  // Evaluation documents (tighter margins)
  evaluation: {
    paddingTop: 73,
    paddingBottom: 79,
    paddingLeft: 72,
    paddingRight: 79,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textBlack,
    lineHeight: 1.08,
  },
  
  // Cover page
  cover: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
  },
  
  // Activity plan
  activityPlan: {
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

// ============================================
// Common Table Styles
// ============================================
export const tableStyles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textBlack,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 25,
  },
  rowLast: {
    flexDirection: 'row',
    minHeight: 25,
  },
  cellLabel: {
    padding: 7,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  cellValue: {
    flex: 1,
    padding: 7,
  },
});

// ============================================
// Common Text Styles
// ============================================
export const textStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 11,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 1.3,
  },
  centered: {
    textAlign: 'center',
  },
  bold: {
    fontFamily: fonts.bold,
  },
});

// ============================================
// Signature Styles
// ============================================
export const signatureStyles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  date: {
    textAlign: 'center',
    marginBottom: 15,
  },
  line: {
    marginTop: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
});
