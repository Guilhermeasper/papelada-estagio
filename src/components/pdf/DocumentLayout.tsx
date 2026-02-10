import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import { getAssetPath } from "../../utils/asset";
import { colors, fonts } from "./styles";

const styles = StyleSheet.create({
  page: {
    paddingTop: 100, // Space for header
    paddingBottom: 60, // Space for footer
    paddingHorizontal: 60,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textBlack,
  },
  header: {
    position: "absolute",
    top: 30,
    left: 60,
    right: 60,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: colors.textBlack,
  },
  headerSubText: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: "#666",
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
});

interface DocumentLayoutProps {
  children: React.ReactNode;
}

export const DocumentLayout = ({ children }: DocumentLayoutProps) => {
  const { header } = PDF_CONTENT;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {/* Using absolute paths for public folder images, relative checks might fail in preview if not handled by PDF renderer properly, assuming standard public handling */}
            <Image
              src={getAssetPath("/logo_ufpe.png")}
              style={{ width: 25, height: 40 }}
            />
            <Image
              src={getAssetPath("/logo_cin.png")}
              style={{ width: 32, height: 32 }}
            />
            <View>
              <Text style={styles.headerText}>{header.university}</Text>
              <Text style={styles.headerSubText}>{header.institution}</Text>
            </View>
          </View>
        </View>

        {children}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Gerado via Papelada Estágio | CIn-UFPE
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
