import { Page } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { pageStyles } from "./styles";

export type PageVariant =
  | "default"
  | "evaluation"
  | "cover"
  | "activityPlan"
  | "report";

interface PDFPageProps {
  variant?: PageVariant;
  children: ReactNode;
  wrap?: boolean;
}

export function PDFPage({ variant = "default", children, wrap }: PDFPageProps) {
  const style = pageStyles[variant];

  return (
    <Page size="A4" style={style} wrap={wrap}>
      {children}
    </Page>
  );
}
