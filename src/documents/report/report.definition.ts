import { DocumentDefinition } from "@papelada-estagio/types";
import { ReportDocument } from "./ReportDocument";
import { reportMetadata } from "./report.meta";

export const reportDefinition: DocumentDefinition = {
  ...reportMetadata,
  Component: ReportDocument,
};
