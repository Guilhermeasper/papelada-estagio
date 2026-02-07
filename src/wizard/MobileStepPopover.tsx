/**
 * MobileStepPopover - Popover de navegação de passos para mobile
 * Usa a API nativa Popover do browser
 */

import { useRef } from 'react';
import { IStepInfo, WizardStep } from '../shared/domain/types';

interface MobileStepPopoverProps {
  currentStep: WizardStep;
  steps: IStepInfo[];
  completedSteps: WizardStep[];
  onStepClick?: (step: WizardStep) => void;
}

export function MobileStepPopover({ currentStep, steps, completedSteps, onStepClick }: MobileStepPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentStepInfo = steps.find((s) => s.step === currentStep);

  // A step is clickable if it's completed (reviewable), step 1, or is the current step
  const isStepClickable = (step: WizardStep) => 
    step === 1 || completedSteps.includes(step) || step === currentStep;

  const handleStepClick = (step: IStepInfo) => {
    if (isStepClickable(step.step) && onStepClick) {
      onStepClick(step.step);
      // Close popover after navigation
      popoverRef.current?.hidePopover();
    }
  };

  const closePopover = () => {
    popoverRef.current?.hidePopover();
  };

  return (
    <>
      {/* Trigger Button - Shows current step info */}
      <button
        // @ts-expect-error - popoverTarget is a new attribute
        popovertarget="steps-popover"
        className="w-full flex items-center justify-between bg-surface-elevated dark:bg-surface-elevated-dark border border-border dark:border-border-dark rounded-lg p-3 shadow-sm hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cin-red text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {currentStep}
          </div>
          <div className="text-left">
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">Passo {currentStep} de {steps.length}</p>
            <p className="text-sm font-semibold text-cin-red">{currentStepInfo?.title}</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Content */}
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-elevated-dark sticky top-0">
          <h2 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">Navegação</h2>
          <button
            onClick={closePopover}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-text-secondary/20 dark:hover:bg-text-secondary-dark/20 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6 text-text-primary dark:text-text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps List */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 70px)' }}>
          <ol className="flex flex-col gap-2">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.step);
              const isCurrent = step.step === currentStep;
              const isClickable = isStepClickable(step.step);
              // Completed but not currently being viewed = solid with checkmark
              const isCompletedNotViewing = isCompleted && !isCurrent;

              return (
                <li key={step.step}>
                  <button
                    onClick={() => handleStepClick(step)}
                    disabled={!isClickable}
                    className={`
                      w-full flex items-start gap-4 p-4 rounded-xl transition-all
                      ${isCurrent ? 'bg-cin-red/10 border-2 border-cin-red' : 'bg-text-secondary/10 dark:bg-text-secondary-dark/10 border-2 border-transparent'}
                      ${isClickable ? 'hover:bg-cin-red/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    {/* Step Circle */}
                    <div
                      className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        font-semibold text-sm
                        ${
                          isCompletedNotViewing 
                            ? 'bg-cin-red text-white' 
                            : isCurrent || isCompleted
                            ? 'bg-transparent border-2 border-cin-red text-cin-red' 
                            : 'bg-border dark:bg-border-dark text-text-secondary dark:text-text-secondary-dark'
                        }
                      `}
                    >
                      {isCompletedNotViewing ? (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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

                    {/* Step Info */}
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${isCurrent ? 'text-cin-red' : isCompleted ? 'text-cin-red/80' : 'text-text-secondary dark:text-text-secondary-dark'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">{step.description}</p>
                      {step.requirements && step.requirements.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {step.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary dark:text-text-secondary-dark">
                              <span className="text-cin-red mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Status indicator */}
                    {isClickable && !isCurrent && (
                      <svg className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
