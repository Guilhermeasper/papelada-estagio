import { useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

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

const getSourceLabels = (t: TFunction): Record<ChecklistSource, string> => ({
  gerado: t("checklist.sources.gerado"),
  externo: t("checklist.sources.externo"),
});

export function useSourceLabels(): Record<ChecklistSource, string> {
  const { t } = useTranslation();
  return useMemo(() => getSourceLabels(t), [t]);
}

const getChecklistData = (t: TFunction): ChecklistCardData[] => [
  {
    title: t("checklist.items.planTitle"),
    description: t("checklist.items.planDesc"),
    source: "gerado",
    items: [
      {
        label: t("checklist.items.planItem1Label"),
        content: t("checklist.items.planItem1Content"),
      },
      {
        label: t("checklist.items.planItem2Label"),
        content: t("checklist.items.planItem2Content"),
      },
      {
        label: t("checklist.items.planItem3Label"),
        content: t("checklist.items.planItem3Content"),
      },
      {
        label: t("checklist.items.planItem4Label"),
        content: t("checklist.items.planItem4Content"),
      },
      {
        label: t("checklist.items.planItem5Label"),
        content: t("checklist.items.planItem5Content"),
      },
      {
        label: t("checklist.items.planItem6Label"),
        content: t("checklist.items.planItem6Content"),
      },
    ],
  },
  {
    title: t("checklist.items.declarationTitle"),
    description: t("checklist.items.declarationDesc"),
    source: "externo",
    items: [
      {
        label: t("checklist.items.declarationItem1Label"),
        content: t("checklist.items.declarationItem1Content"),
      },
      {
        label: t("checklist.items.declarationItem2Label"),
        content: t("checklist.items.declarationItem2Content"),
      },
      {
        label: t("checklist.items.declarationItem3Label"),
        content: t("checklist.items.declarationItem3Content"),
      },
      {
        label: t("checklist.items.declarationItem4Label"),
        content: t("checklist.items.declarationItem4Content"),
      },
      {
        label: t("checklist.items.declarationItem5Label"),
        content: t("checklist.items.declarationItem5Content"),
      },
    ],
  },
  {
    title: t("checklist.items.ctpsTitle"),
    description: t("checklist.items.ctpsDesc"),
    source: "externo",
    items: [
      { content: t("checklist.items.ctpsItem1Content") },
      { content: t("checklist.items.ctpsItem2Content") },
    ],
  },
  {
    title: t("checklist.items.reportTitle"),
    description: t("checklist.items.reportDesc"),
    source: "gerado",
    items: [
      {
        label: t("checklist.items.reportItem1Label"),
        content: t("checklist.items.reportItem1Content"),
      },
      {
        label: t("checklist.items.reportItem2Label"),
        content: t("checklist.items.reportItem2Content"),
      },
      {
        label: t("checklist.items.reportItem3Label"),
        content: t("checklist.items.reportItem3Content"),
      },
      {
        label: t("checklist.items.reportItem4Label"),
        content: t("checklist.items.reportItem4Content"),
      },
      {
        label: t("checklist.items.reportItem5Label"),
        content: t("checklist.items.reportItem5Content"),
      },
    ],
  },
  {
    title: t("checklist.items.advisorEvalTitle"),
    description: t("checklist.items.advisorEvalDesc"),
    source: "gerado",
    items: [
      {
        label: t("checklist.items.advisorEvalItem1Label"),
        content: t("checklist.items.advisorEvalItem1Content"),
      },
      {
        label: t("checklist.items.advisorEvalItem2Label"),
        content: t("checklist.items.advisorEvalItem2Content"),
      },
      {
        label: t("checklist.items.advisorEvalItem3Label"),
        content: t("checklist.items.advisorEvalItem3Content"),
      },
    ],
  },
  {
    title: t("checklist.items.supervisorEvalTitle"),
    description: t("checklist.items.supervisorEvalDesc"),
    source: "gerado",
    items: [
      {
        label: t("checklist.items.supervisorEvalItem1Label"),
        content: t("checklist.items.supervisorEvalItem1Content"),
      },
      {
        label: t("checklist.items.supervisorEvalItem2Label"),
        content: t("checklist.items.supervisorEvalItem2Content"),
      },
      {
        label: t("checklist.items.supervisorEvalItem3Label"),
        content: t("checklist.items.supervisorEvalItem3Content"),
      },
    ],
  },
];

export function useChecklistData(): ChecklistCardData[] {
  const { t } = useTranslation();
  return useMemo(() => getChecklistData(t), [t]);
}
