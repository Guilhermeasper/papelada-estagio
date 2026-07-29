import { DocumentMetadata } from "@papelada-estagio/types";
import i18n from "../../i18n";

export const getReportMetadata = (): DocumentMetadata => ({
  id: "report",
  label: i18n.t("download.docOptions.report.label"),
  description: i18n.t("download.docOptions.report.desc"),
  filename: "relatorio-estagio.pdf",
});

export const reportMetadata: DocumentMetadata = new Proxy(
  {} as DocumentMetadata,
  {
    get(_target, prop: keyof DocumentMetadata) {
      return getReportMetadata()[prop];
    },
  },
);
