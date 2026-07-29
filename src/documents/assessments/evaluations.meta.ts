import { DocumentMetadata } from "@papelada-estagio/types";
import i18n from "../../i18n";

export const getAdvisorEvaluationMetadata = (): DocumentMetadata => ({
  id: "advisor-eval",
  label: i18n.t("download.docOptions.advisorEval.label"),
  description: i18n.t("download.docOptions.advisorEval.desc"),
  filename: "avaliacao-orientador.pdf",
});

export const advisorEvaluationMetadata: DocumentMetadata = new Proxy(
  {} as DocumentMetadata,
  {
    get(_target, prop: keyof DocumentMetadata) {
      return getAdvisorEvaluationMetadata()[prop];
    },
  },
);

export const getSupervisorEvaluationMetadata = (): DocumentMetadata => ({
  id: "supervisor-eval",
  label: i18n.t("download.docOptions.supervisorEval.label"),
  description: i18n.t("download.docOptions.supervisorEval.desc"),
  filename: "avaliacao-supervisor.pdf",
});

export const supervisorEvaluationMetadata: DocumentMetadata = new Proxy(
  {} as DocumentMetadata,
  {
    get(_target, prop: keyof DocumentMetadata) {
      return getSupervisorEvaluationMetadata()[prop];
    },
  },
);
