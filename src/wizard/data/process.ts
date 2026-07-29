import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

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

export const getBeforeStage = (): ProcessStageData => ({
  title: i18n.t("process.before.title"),
  description: i18n.t("process.before.description"),
  steps: [
    {
      label: i18n.t("process.before.step1Label"),
      content: i18n.t("process.before.step1Content"),
      highlight: true,
    },
    {
      label: i18n.t("process.before.step2Label"),
      content: i18n.t("process.before.step2Content"),
      link: SECGRAD_FAQ_URL,
    },
    {
      label: i18n.t("process.before.step3Label"),
      content: i18n.t("process.before.step3Content"),
    },
    {
      label: i18n.t("process.before.step4Label"),
      content: i18n.t("process.before.step4Content"),
    },
  ],
});

export function useBeforeStage(): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getBeforeStage(), [t]);
}

export const getAfterStage = (): ProcessStageData => ({
  title: i18n.t("process.after.title"),
  description: i18n.t("process.after.description"),
  steps: [
    {
      label: i18n.t("process.after.step1Label"),
      content: i18n.t("process.after.step1Content"),
      highlight: true,
    },
    {
      label: i18n.t("process.after.step2Label"),
      content: i18n.t("process.after.step2Content"),
    },
    {
      label: i18n.t("process.after.step3Label"),
      content: i18n.t("process.after.step3Content"),
    },
    {
      label: i18n.t("process.after.step4Label"),
      content: i18n.t("process.after.step4Content"),
    },
    {
      label: i18n.t("process.after.step5Label"),
      content: i18n.t("process.after.step5Content"),
    },
  ],
});

export function useAfterStage(): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getAfterStage(), [t]);
}
