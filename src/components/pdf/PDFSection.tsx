import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactNode } from "react";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  title: {
    fontSize: 10,
    fontFamily: fonts.bold,
    marginBottom: 14,
  },
});

interface PDFSectionProps {
  number?: number | string;
  title: string;
  children?: ReactNode;
  style?: Style;
  titleStyle?: Style;
}

export function PDFSection({
  number,
  title,
  children,
  style,
  titleStyle,
}: PDFSectionProps) {
  const titleText = number ? `${number}. ${title}` : title;
  const containerStyle = [styles.container, style].filter(Boolean) as Style[];
  const combinedTitleStyle = [styles.title, titleStyle].filter(
    Boolean,
  ) as Style[];

  return (
    <View style={containerStyle}>
      <Text style={combinedTitleStyle}>{titleText}</Text>
      {children}
    </View>
  );
}
