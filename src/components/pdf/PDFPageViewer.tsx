import { PDFViewer } from "@react-pdf/renderer";
import type { ComponentProps } from "react";

interface PDFPageViewerProps {
  children: NonNullable<ComponentProps<typeof PDFViewer>["children"]>;
}

export function PDFPageViewer({ children }: PDFPageViewerProps) {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh", border: "none" }}>
      {children}
    </PDFViewer>
  );
}
