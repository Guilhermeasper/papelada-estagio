import { Button, ChecklistCard, ChecklistItem } from "../../components";
import type { IStep1Props } from "../step-types";
import { checklistData } from "./checklistData";

export function ChecklistStep({ onNext }: IStep1Props) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Antes de começar
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Para gerar os documentos do estágio CLT, você precisará das seguintes
          informações. Confira cada documento:
        </p>
      </div>

      <div className="space-y-4">
        {checklistData.map((card, cardIndex) => (
          <ChecklistCard
            key={cardIndex}
            title={card.title}
            description={card.description}
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
          Tenho tudo em mãos
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
