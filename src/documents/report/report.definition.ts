import { DocumentDefinition, IInternshipData } from "@papelada-estagio/types";
import { fullInternshipSchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
import { ReportDocument } from "./ReportDocument";
import { reportMetadata } from "./report.meta";

export const reportDefinition: DocumentDefinition<IInternshipData> = {
  ...reportMetadata,
  schema: fullInternshipSchema,
  Component: ReportDocument,
};
