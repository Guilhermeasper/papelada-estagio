import { DocumentMetadata } from "@papelada-estagio/types";
import i18n from "../../i18n";

export const getActivityPlanMetadata = (): DocumentMetadata => ({
  id: "activity-plan",
  label: i18n.t("download.docOptions.activityPlan.label"),
  description: i18n.t("download.docOptions.activityPlan.desc"),
  filename: "plano-atividades.pdf",
});

export const activityPlanMetadata: DocumentMetadata = new Proxy(
  {} as DocumentMetadata,
  {
    get(_target, prop: keyof DocumentMetadata) {
      return getActivityPlanMetadata()[prop];
    },
  },
);
