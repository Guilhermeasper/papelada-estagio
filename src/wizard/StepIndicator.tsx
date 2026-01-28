/**
 * StepIndicator - Indicador visual dos passos do wizard
 */

import { IStepInfo, WizardStep } from '../shared/domain/types';

interface StepIndicatorProps {
  currentStep: WizardStep;
  steps: IStepInfo[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progresso" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.step}
              className={`relative flex-1 ${!isLast ? 'pr-4' : ''}`}
            >
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                    font-semibold text-sm transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-cin-red text-white'
                        : isCurrent
                        ? 'bg-cin-red text-white ring-4 ring-cin-red/20'
                        : 'bg-cin-gray text-cin-black/60'
                    }
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
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

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded
                      transition-all duration-300
                      ${isCompleted ? 'bg-cin-red' : 'bg-cin-gray'}
                    `}
                  />
                )}
              </div>

              {/* Step Label - Only show on larger screens */}
              <div className="hidden md:block mt-2">
                <p
                  className={`
                    text-xs font-medium truncate max-w-[100px]
                    ${isCurrent ? 'text-cin-red' : 'text-cin-black/60'}
                  `}
                >
                  {step.title}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Current Step Title - Mobile */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm text-cin-black/60">
          Passo {currentStep} de {steps.length}
        </p>
        <p className="text-lg font-semibold text-cin-red">
          {steps.find((s) => s.step === currentStep)?.title}
        </p>
      </div>
    </nav>
  );
}
