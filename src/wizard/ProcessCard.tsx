import { ChecklistCard, ChecklistItem } from "@papelada-estagio/components";
import { ProcessStageData } from "@papelada-estagio/wizard/data/process";

interface ProcessCardProps {
  stage: ProcessStageData;
}

export function ProcessCard({ stage }: ProcessCardProps) {
  return (
    <ChecklistCard title={stage.title} description={stage.description}>
      {stage.steps.map((step, index) => (
        <ChecklistItem
          key={`step-${index}-${step.label}`}
          label={step.label}
          highlight={step.highlight}
        >
          {step.content}
          {step.link && (
            <>
              {" "}
              <a
                href={step.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent underline underline-offset-2 break-words"
              >
                {step.link.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </ChecklistItem>
      ))}
    </ChecklistCard>
  );
}
