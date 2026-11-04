import { useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export interface ProcessStepData {
  label: string;
  content: string;
  link?: string;
  highlight?: boolean;
}

export interface ProcessStageData {
  title: string;
  description: string;
  steps: ProcessStepData[];
}

export const SECGRAD_FAQ_URL =
  "https://secgrad.cin.ufpe.br/perguntas-frequentes";

const getBeforeStage = (t: TFunction): ProcessStageData => ({
  title: t("process.before.title"),
  description: t("process.before.description"),
  steps: [
    {
      label: t("process.before.step1Label"),
      content: t("process.before.step1Content"),
      highlight: true,
    },
    {
      label: t("process.before.step2Label"),
      content: t("process.before.step2Content"),
      link: SECGRAD_FAQ_URL,
    },
    {
      label: t("process.before.step3Label"),
      content: t("process.before.step3Content"),
    },
    {
      label: t("process.before.step4Label"),
      content: t("process.before.step4Content"),
    },
  ],
});

export function useBeforeStage(): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getBeforeStage(t), [t]);
}

const getAfterStage = (t: TFunction): ProcessStageData => ({
  title: t("process.after.title"),
  description: t("process.after.description"),
  steps: [
    {
      label: t("process.after.step1Label"),
      content: t("process.after.step1Content"),
      highlight: true,
    },
    {
      label: t("process.after.step2Label"),
      content: t("process.after.step2Content"),
    },
    {
      label: t("process.after.step3Label"),
      content: t("process.after.step3Content"),
    },
    {
      label: t("process.after.step4Label"),
      content: t("process.after.step4Content"),
    },
    {
      label: t("process.after.step5Label"),
      content: t("process.after.step5Content"),
    },
  ],
});

export function useAfterStage(): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getAfterStage(t), [t]);
}
