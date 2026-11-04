import { IStepInfo } from "@papelada-estagio/types";
import { useMemo } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const getSteps = (t: TFunction): IStepInfo[] => [
  {
    step: 1,
    title: t("steps.step1.title"),
    description: t("steps.step1.description"),
    requirements: [
      t("steps.step1.req1"),
      t("steps.step1.req2"),
      t("steps.step1.req3"),
      t("steps.step1.req4"),
      t("steps.step1.req5"),
      t("steps.step1.req6"),
    ],
  },
  {
    step: 2,
    title: t("steps.step2.title"),
    description: t("steps.step2.description"),
    requirements: [
      t("steps.step2.req1"),
      t("steps.step2.req2"),
      t("steps.step2.req3"),
      t("steps.step2.req4"),
      t("steps.step2.req5"),
      t("steps.step2.req6"),
    ],
  },
  {
    step: 3,
    title: t("steps.step3.title"),
    description: t("steps.step3.description"),
    requirements: [
      t("steps.step3.req1"),
      t("steps.step3.req2"),
      t("steps.step3.req3"),
    ],
  },
  {
    step: 4,
    title: t("steps.step4.title"),
    description: t("steps.step4.description"),
    requirements: [
      t("steps.step4.req1"),
      t("steps.step4.req2"),
      t("steps.step4.req3"),
      t("steps.step4.req4"),
      t("steps.step4.req5"),
    ],
  },
  {
    step: 5,
    title: t("steps.step5.title"),
    description: t("steps.step5.description"),
    requirements: [
      t("steps.step5.req1"),
      t("steps.step5.req2"),
      t("steps.step5.req3"),
    ],
  },
  {
    step: 6,
    title: t("steps.step6.title"),
    description: t("steps.step6.description"),
    requirements: [
      t("steps.step6.req1"),
      t("steps.step6.req2"),
      t("steps.step6.req3"),
    ],
  },
  {
    step: 7,
    title: t("steps.step7.title"),
    description: t("steps.step7.description"),
    requirements: [t("steps.step7.req1"), t("steps.step7.req2")],
  },
  {
    step: 8,
    title: t("steps.step8.title"),
    description: t("steps.step8.description"),
    requirements: [t("steps.step8.req1"), t("steps.step8.req2")],
  },
];

export function useSteps(): IStepInfo[] {
  const { t } = useTranslation();
  return useMemo(() => getSteps(t), [t]);
}

export const TOTAL_STEPS = 8;
