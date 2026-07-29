import { IStepInfo } from "@papelada-estagio/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

export const getSteps = (): IStepInfo[] => [
  {
    step: 1,
    title: i18n.t("steps.step1.title"),
    description: i18n.t("steps.step1.description"),
    requirements: [
      i18n.t("steps.step1.req1"),
      i18n.t("steps.step1.req2"),
      i18n.t("steps.step1.req3"),
      i18n.t("steps.step1.req4"),
      i18n.t("steps.step1.req5"),
      i18n.t("steps.step1.req6"),
    ],
  },
  {
    step: 2,
    title: i18n.t("steps.step2.title"),
    description: i18n.t("steps.step2.description"),
    requirements: [
      i18n.t("steps.step2.req1"),
      i18n.t("steps.step2.req2"),
      i18n.t("steps.step2.req3"),
      i18n.t("steps.step2.req4"),
      i18n.t("steps.step2.req5"),
      i18n.t("steps.step2.req6"),
    ],
  },
  {
    step: 3,
    title: i18n.t("steps.step3.title"),
    description: i18n.t("steps.step3.description"),
    requirements: [
      i18n.t("steps.step3.req1"),
      i18n.t("steps.step3.req2"),
      i18n.t("steps.step3.req3"),
    ],
  },
  {
    step: 4,
    title: i18n.t("steps.step4.title"),
    description: i18n.t("steps.step4.description"),
    requirements: [
      i18n.t("steps.step4.req1"),
      i18n.t("steps.step4.req2"),
      i18n.t("steps.step4.req3"),
      i18n.t("steps.step4.req4"),
      i18n.t("steps.step4.req5"),
    ],
  },
  {
    step: 5,
    title: i18n.t("steps.step5.title"),
    description: i18n.t("steps.step5.description"),
    requirements: [
      i18n.t("steps.step5.req1"),
      i18n.t("steps.step5.req2"),
      i18n.t("steps.step5.req3"),
    ],
  },
  {
    step: 6,
    title: i18n.t("steps.step6.title"),
    description: i18n.t("steps.step6.description"),
    requirements: [
      i18n.t("steps.step6.req1"),
      i18n.t("steps.step6.req2"),
      i18n.t("steps.step6.req3"),
    ],
  },
  {
    step: 7,
    title: i18n.t("steps.step7.title"),
    description: i18n.t("steps.step7.description"),
    requirements: [i18n.t("steps.step7.req1"), i18n.t("steps.step7.req2")],
  },
  {
    step: 8,
    title: i18n.t("steps.step8.title"),
    description: i18n.t("steps.step8.description"),
    requirements: [i18n.t("steps.step8.req1"), i18n.t("steps.step8.req2")],
  },
];

export function useSteps(): IStepInfo[] {
  const { t } = useTranslation();
  return useMemo(() => getSteps(), [t]);
}

export const TOTAL_STEPS = 8;
