import { Button } from "@papelada-estagio/components";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface StepFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextType?: "submit" | "button";
  isSubmitting?: boolean;
  right?: ReactNode;
  className?: string;
}

export function StepFooter({
  onBack,
  onNext,
  nextLabel,
  backLabel,
  nextType = "submit",
  isSubmitting,
  right,
  className = "",
}: StepFooterProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex justify-between items-center pt-6 border-t border-border dark:border-border-dark ${className}`}
    >
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {backLabel || t("app.back")}
        </Button>
      ) : (
        <div />
      )}

      {right ?? (
        <Button type={nextType} onClick={onNext} isLoading={isSubmitting}>
          {nextLabel || t("app.next")}
          <svg
            className="w-4 h-4"
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
      )}
    </div>
  );
}
