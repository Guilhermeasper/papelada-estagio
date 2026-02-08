import { useState } from "react";
import { IStepInfo, WizardStep } from "../types/types";

interface StepIndicatorProps {
  currentStep: WizardStep;
  steps: IStepInfo[];
  completedSteps: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
}

export function StepIndicator({
  currentStep,
  steps,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<WizardStep | null>(null);

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
    }
  };

  return (
    <nav aria-label="Progresso" className="w-full">
      <ol className="flex flex-col gap-0">
        {steps.map((step, index) => {
          const isCompleted =
            step.step === 1
              ? completedSteps.length > 0
              : completedSteps.includes(step.step);
          const isCurrent = step.step === currentStep;
          const isClickable = isStepClickable(step.step);
          const isLast = index === steps.length - 1;
          const isHovered = hoveredStep === step.step;
          const isWorkingStep = step.step === workingStep;

          const isCompletedNotViewing = isCompleted && !isCurrent;

          return (
            <li key={step.step} className="relative">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                      font-semibold text-xs md:text-sm transition-all duration-300 shrink-0
                      ${
                        isCompletedNotViewing
                          ? "bg-cin-red text-white"
                          : isCurrent
                            ? "bg-transparent border-2 border-cin-red text-cin-red ring-4 ring-cin-red/20"
                            : isCompleted || isWorkingStep
                              ? "bg-transparent border-2 border-cin-red text-cin-red"
                              : "bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark"
                      }
                      ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                    `}
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => handleStepClick(step)}
                    onMouseEnter={() => setHoveredStep(step.step)}
                    onMouseLeave={() => setHoveredStep(null)}
                    role="button"
                    tabIndex={isClickable ? 0 : -1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleStepClick(step);
                      }
                    }}
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

                    {isHovered &&
                      step.requirements &&
                      step.requirements.length > 0 && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 w-max max-w-xs">
                          <div className="bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark text-xs rounded-lg py-2 px-3 shadow-lg border border-border dark:border-border-dark">
                            <p className="font-semibold mb-1 text-cin-red">
                              {step.title}
                            </p>
                            <ul className="space-y-0.5">
                              {step.requirements.map(
                                (req: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-1.5"
                                  >
                                    <span className="text-cin-red mt-0.5">
                                      •
                                    </span>
                                    <span>{req}</span>
                                  </li>
                                ),
                              )}
                            </ul>

                            <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-px">
                              <div className="border-8 border-transparent border-r-surface-elevated dark:border-r-surface-elevated-dark" />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {!isLast && (
                    <div
                      className={`
                        w-1 h-8 rounded
                        transition-all duration-300
                        ${isCompleted ? "bg-cin-red" : "bg-border dark:bg-border-dark"}
                      `}
                    />
                  )}
                </div>

                <div
                  className={`pt-2 ${isClickable ? "cursor-pointer" : ""}`}
                  onClick={() => handleStepClick(step)}
                >
                  <p
                    className={`
                      text-sm md:text-base font-medium
                      ${isCurrent ? "text-cin-red" : isCompleted ? "text-cin-red/70" : "text-text-secondary dark:text-text-secondary-dark"}
                      ${isClickable ? "hover:underline" : ""}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] md:text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
