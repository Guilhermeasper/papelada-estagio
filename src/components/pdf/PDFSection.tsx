import { StyleSheet, Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ReactNode } from "react";
import { fonts } from "./styles";

const styles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontFamily: fonts.bold,
    marginTop: 12,
    marginBottom: 14,
  },
});

interface PDFSectionProps {
  number?: number | string;
  title: string;
  children?: ReactNode;
  titleStyle?: Style;
  minPresenceAhead?: number;
}

export function PDFSection({
  number,
  title,
  children,
  titleStyle,
  minPresenceAhead = 40,
}: PDFSectionProps) {
  const titleText = number ? `${number}. ${title}` : title;
  const combinedTitleStyle = [styles.title, titleStyle].filter(
    Boolean,
  ) as Style[];

  return (
    <>
      <Text style={combinedTitleStyle} minPresenceAhead={minPresenceAhead}>
        {titleText}
      </Text>
      {children}
    </>
  );
}
