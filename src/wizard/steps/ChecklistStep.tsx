import { ChecklistCard, ChecklistItem } from "@papelada-estagio/components";
import { IStep1Props } from "@papelada-estagio/types";
import { ProcessCard } from "@papelada-estagio/wizard/ProcessCard";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import {
  useChecklistData,
  useSourceLabels,
} from "@papelada-estagio/wizard/data/checklist";
import { useBeforeStage } from "@papelada-estagio/wizard/data/process";
import { useTranslation } from "react-i18next";

export function ChecklistStep({ onNext }: IStep1Props) {
  const { t } = useTranslation();
  const checklistData = useChecklistData();
  const sourceLabels = useSourceLabels();
  const beforeStage = useBeforeStage();

  return (
    <div className="space-y-6">
      <StepHeader
        title={t("checklist.beforeTitle")}
        subtitle={t("checklist.beforeSubtitle")}
      />

      <ProcessCard stage={beforeStage} />

      <div className="space-y-4">
        {checklistData.map((card) => (
          <ChecklistCard
            key={card.title}
            title={card.title}
            description={card.description}
            badge={{
              label: sourceLabels[card.source],
              variant: card.source,
            }}
          >
            {card.items.map((item) => (
              <ChecklistItem key={item.content} label={item.label}>
                {item.content}
              </ChecklistItem>
            ))}
          </ChecklistCard>
        ))}
      </div>

      <StepFooter
        onNext={onNext}
        nextLabel={t("checklist.readyButton")}
        nextType="button"
        className="mt-8"
      />
    </div>
  );
}
