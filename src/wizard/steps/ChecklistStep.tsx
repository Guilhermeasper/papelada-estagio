import { Button, ChecklistCard, ChecklistItem } from "@papelada-estagio/components";
import { IStep1Props } from "@papelada-estagio/types";
import { ProcessCard } from "@papelada-estagio/wizard/ProcessCard";
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
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          {t("checklist.beforeTitle")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          {t("checklist.beforeSubtitle")}
        </p>
      </div>

      <ProcessCard stage={beforeStage} />

      <div className="space-y-4">
        {checklistData.map((card, cardIndex) => (
          <ChecklistCard
            key={cardIndex}
            title={card.title}
            description={card.description}
            badge={{
              label: sourceLabels[card.source],
              variant: card.source,
            }}
          >
            {card.items.map((item, itemIndex) => (
              <ChecklistItem key={itemIndex} label={item.label}>
                {item.content}
              </ChecklistItem>
            ))}
          </ChecklistCard>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-border dark:border-border-dark mt-8">
        <Button onClick={onNext}>
          {t("checklist.readyButton")}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
