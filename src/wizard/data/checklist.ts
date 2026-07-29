import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export type ChecklistSource = "gerado" | "externo";

export interface ChecklistItemData {
  label?: string;
  content: string;
}

export interface ChecklistCardData {
  title: string;
  description: string;
  source: ChecklistSource;
  items: ChecklistItemData[];
}

export const getSourceLabels = (): Record<ChecklistSource, string> => ({
  gerado: i18n.t("checklist.sources.gerado"),
  externo: i18n.t("checklist.sources.externo"),
});

export function useSourceLabels(): Record<ChecklistSource, string> {
  const { t } = useTranslation();
  return useMemo(() => getSourceLabels(), [t]);
}

export const getChecklistData = (): ChecklistCardData[] => [
  {
    title: i18n.t("checklist.items.planTitle"),
    description: i18n.t("checklist.items.planDesc"),
    source: "gerado",
    items: [
      {
        label: i18n.t("checklist.items.planItem1Label"),
        content: i18n.t("checklist.items.planItem1Content"),
      },
      {
        label: i18n.t("checklist.items.planItem2Label"),
        content: i18n.t("checklist.items.planItem2Content"),
      },
      {
        label: i18n.t("checklist.items.planItem3Label"),
        content: i18n.t("checklist.items.planItem3Content"),
      },
      {
        label: i18n.t("checklist.items.planItem4Label"),
        content: i18n.t("checklist.items.planItem4Content"),
      },
      {
        label: i18n.t("checklist.items.planItem5Label"),
        content: i18n.t("checklist.items.planItem5Content"),
      },
      {
        label: i18n.t("checklist.items.planItem6Label"),
        content: i18n.t("checklist.items.planItem6Content"),
      },
    ],
  },
  {
    title: i18n.t("checklist.items.declarationTitle"),
    description: i18n.t("checklist.items.declarationDesc"),
    source: "externo",
    items: [
      {
        label: i18n.t("checklist.items.declarationItem1Label"),
        content: i18n.t("checklist.items.declarationItem1Content"),
      },
      {
        label: i18n.t("checklist.items.declarationItem2Label"),
        content: i18n.t("checklist.items.declarationItem2Content"),
      },
      {
        label: i18n.t("checklist.items.declarationItem3Label"),
        content: i18n.t("checklist.items.declarationItem3Content"),
      },
      {
        label: i18n.t("checklist.items.declarationItem4Label"),
        content: i18n.t("checklist.items.declarationItem4Content"),
      },
      {
        label: i18n.t("checklist.items.declarationItem5Label"),
        content: i18n.t("checklist.items.declarationItem5Content"),
      },
    ],
  },
  {
    title: i18n.t("checklist.items.ctpsTitle"),
    description: i18n.t("checklist.items.ctpsDesc"),
    source: "externo",
    items: [
      { content: i18n.t("checklist.items.ctpsItem1Content") },
      { content: i18n.t("checklist.items.ctpsItem2Content") },
    ],
  },
  {
    title: i18n.t("checklist.items.reportTitle"),
    description: i18n.t("checklist.items.reportDesc"),
    source: "gerado",
    items: [
      {
        label: i18n.t("checklist.items.reportItem1Label"),
        content: i18n.t("checklist.items.reportItem1Content"),
      },
      {
        label: i18n.t("checklist.items.reportItem2Label"),
        content: i18n.t("checklist.items.reportItem2Content"),
      },
      {
        label: i18n.t("checklist.items.reportItem3Label"),
        content: i18n.t("checklist.items.reportItem3Content"),
      },
      {
        label: i18n.t("checklist.items.reportItem4Label"),
        content: i18n.t("checklist.items.reportItem4Content"),
      },
      {
        label: i18n.t("checklist.items.reportItem5Label"),
        content: i18n.t("checklist.items.reportItem5Content"),
      },
    ],
  },
  {
    title: i18n.t("checklist.items.advisorEvalTitle"),
    description: i18n.t("checklist.items.advisorEvalDesc"),
    source: "gerado",
    items: [
      {
        label: i18n.t("checklist.items.advisorEvalItem1Label"),
        content: i18n.t("checklist.items.advisorEvalItem1Content"),
      },
      {
        label: i18n.t("checklist.items.advisorEvalItem2Label"),
        content: i18n.t("checklist.items.advisorEvalItem2Content"),
      },
      {
        label: i18n.t("checklist.items.advisorEvalItem3Label"),
        content: i18n.t("checklist.items.advisorEvalItem3Content"),
      },
    ],
  },
  {
    title: i18n.t("checklist.items.supervisorEvalTitle"),
    description: i18n.t("checklist.items.supervisorEvalDesc"),
    source: "gerado",
    items: [
      {
        label: i18n.t("checklist.items.supervisorEvalItem1Label"),
        content: i18n.t("checklist.items.supervisorEvalItem1Content"),
      },
      {
        label: i18n.t("checklist.items.supervisorEvalItem2Label"),
        content: i18n.t("checklist.items.supervisorEvalItem2Content"),
      },
      {
        label: i18n.t("checklist.items.supervisorEvalItem3Label"),
        content: i18n.t("checklist.items.supervisorEvalItem3Content"),
      },
    ],
  },
];

export function useChecklistData(): ChecklistCardData[] {
  const { t } = useTranslation();
  return useMemo(() => getChecklistData(), [t]);
}
