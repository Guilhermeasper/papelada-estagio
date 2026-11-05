import { regimeHasSupervisor } from "@papelada-estagio/constants/internshipRules";
import type { InternshipRegime } from "@papelada-estagio/types";
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

export const SECGRAD_INTERNSHIP_URL = "https://secgrad.cin.ufpe.br/estágio";

const getBeforeStage = (t: TFunction): ProcessStageData => ({
  title: t("process.before.title"),
  description: t("process.before.description"),
  steps: [
    {
      label: t("process.before.step1Label"),
      content: t("process.before.step1Content"),
    },
    {
      label: t("process.before.step2Label"),
      content: t("process.before.step2Content"),
      highlight: true,
    },
    {
      label: t("process.before.step3Label"),
      content: t("process.before.step3Content"),
      link: SECGRAD_INTERNSHIP_URL,
    },
    {
      label: t("process.before.step4Label"),
      content: t("process.before.step4Content"),
    },
    {
      label: t("process.before.step5Label"),
      content: t("process.before.step5Content"),
    },
  ],
});

export function useBeforeStage(): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getBeforeStage(t), [t]);
}

const getAfterStage = (
  t: TFunction,
  regime: InternshipRegime,
): ProcessStageData => ({
  title: t("process.after.title"),
  description: t("process.after.description"),
  steps: [
    {
      label: t("process.after.step1Label"),
      content: regimeHasSupervisor(regime)
        ? t("process.after.step1ContentWithSupervisor")
        : t("process.after.step1ContentWithoutSupervisor"),
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

export function useAfterStage(regime: InternshipRegime): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getAfterStage(t, regime), [t, regime]);
}

const getFinalStage = (
  t: TFunction,
  regime: InternshipRegime,
): ProcessStageData => ({
  title: t("process.final.title"),
  description: t("process.final.description"),
  steps: [
    {
      label: t("process.final.step1Label"),
      content: t("process.final.step1Content"),
    },
    {
      label: t("process.final.step2Label"),
      content: regimeHasSupervisor(regime)
        ? t("process.final.step2ContentWithSupervisor")
        : t("process.final.step2ContentWithoutSupervisor"),
      highlight: true,
    },
    {
      label: t("process.final.step3Label"),
      content: t("process.final.step3Content"),
    },
    {
      label: t("process.final.step4Label"),
      content: t("process.final.step4Content"),
    },
  ],
});

export function useFinalStage(regime: InternshipRegime): ProcessStageData {
  const { t } = useTranslation();
  return useMemo(() => getFinalStage(t, regime), [t, regime]);
}
