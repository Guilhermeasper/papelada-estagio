import { Document } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { PDFPage, type PageVariant } from "./PDFPage";

interface PDFLayoutProps {
  variant?: PageVariant;
  children: ReactNode;
  wrap?: boolean;
}

export function PDFLayout({ variant, children, wrap }: PDFLayoutProps) {
  return (
    <Document>
      <PDFPage variant={variant} wrap={wrap}>
        {children}
      </PDFPage>
    </Document>
  );
}
