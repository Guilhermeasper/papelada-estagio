import { Button } from "@papelada-estagio/components";
import { IStepInfo, WizardStep } from "@papelada-estagio/types";
import { useRef } from "react";

interface MobileStepPopoverProps {
  currentStep: WizardStep;
  steps: IStepInfo[];
  completedSteps: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
}

export function MobileStepPopover({
  currentStep,
  steps,
  completedSteps,
  onStepClick,
}: MobileStepPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentStepInfo = steps.find((s) => s.step === currentStep);

  const highestCompleted =
    completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
  const workingStep = Math.min(
    highestCompleted + 1,
    steps.length,
  ) as WizardStep;

  const isStepClickable = (step: WizardStep) =>
    step === 1 ||
    completedSteps.includes(step) ||
    step === currentStep ||
    step === workingStep;

  const handleStepClick = (step: IStepInfo) => {
    if (isStepClickable(step.step) && onStepClick) {
      onStepClick(step.step);

      popoverRef.current?.hidePopover();
    }
  };

  const closePopover = () => {
    popoverRef.current?.hidePopover();
  };

  return (
    <>
      <Button
        // @ts-expect-error - popoverTarget is a new attribute
        popovertarget="steps-popover"
        variant="ghost"
        className="w-full flex items-center justify-between bg-surface-elevated dark:bg-surface-elevated-dark border border-border dark:border-border-dark rounded-lg p-3 shadow-sm hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10 transition-colors h-auto"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {currentStep}
          </div>
          <div className="text-left">
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark font-normal">
              Passo {currentStep} de {steps.length}
            </p>
            <p className="text-sm font-semibold text-brand-accent">
              {currentStepInfo?.title}
            </p>
          </div>
        </div>
        <svg
          className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      <div
        ref={popoverRef}
        id="steps-popover"
        popover="auto"
        className="
          fixed inset-0 m-0 w-full h-full max-w-none max-h-none
          bg-surface dark:bg-surface-dark p-0 border-none
          backdrop:bg-black/50
        "
      >
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-elevated-dark sticky top-0">
          <h2 className="text-base font-bold text-text-primary dark:text-text-primary-dark">
            Navegação
          </h2>
          <Button
            onClick={closePopover}
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Fechar"
          >
            <svg
              className="w-6 h-6 text-text-primary dark:text-text-primary-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 70px)" }}
        >
          <ol className="flex flex-col gap-2">
            {steps.map((step) => {
              const isCompleted =
                step.step === 1
                  ? completedSteps.length > 0
                  : completedSteps.includes(step.step);
              const isCurrent = step.step === currentStep;
              const isClickable = isStepClickable(step.step);
              const isWorkingStep = step.step === workingStep;

              const isCompletedNotViewing = isCompleted && !isCurrent;

              return (
                <li key={step.step}>
                  <Button
                    onClick={() => {
                      handleStepClick(step);
                    }}
                    disabled={!isClickable}
                    variant="ghost"
                    className={`
                      w-full items-start justify-start gap-4 p-4 rounded-xl h-auto
                      ${isCurrent ? "bg-brand-accent/10 border-2 border-brand-accent hover:bg-brand-accent/15" : "bg-text-secondary/10 dark:bg-text-secondary-dark/10 border-2 border-transparent"}
                      ${isClickable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
                    `}
                  >
                    <div
                      className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        font-semibold text-sm
                        ${
                          isCompletedNotViewing
                            ? "bg-brand-accent text-white"
                            : isCurrent || isCompleted || isWorkingStep
                              ? "bg-transparent border-2 border-brand-accent text-brand-accent"
                              : "bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark"
                        }
                      `}
                    >
                      {isCompletedNotViewing ? (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.step
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-medium ${isCurrent ? "text-brand-accent" : isCompleted ? "text-brand-accent/80" : "text-text-secondary dark:text-text-secondary-dark"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                        {step.description}
                      </p>
                      {step.requirements && step.requirements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {step.requirements.map((req, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-xs text-text-secondary dark:text-text-secondary-dark"
                            >
                              <span className="text-brand-accent mt-0.5">
                                •
                              </span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {isClickable && !isCurrent && (
                      <svg
                        className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark flex-shrink-0"
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
                    )}
                  </Button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
