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
// Used by PDFPage component
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
