import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  textBlack: "#000000",
  white: "#FFFFFF",

  primaryRed: "#DB1E2F",
  borderGray: "#E0E1E0",

  headerBlue: "#335b8a",
  subheaderBlue: "#4f81bd",
};

export const fonts = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  serif: "Times-Roman",
  serifBold: "Times-Bold",
};

export const pageStyles = StyleSheet.create({
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

  cover: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
  },

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

  report: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
    lineHeight: 1.2,
  },
});
