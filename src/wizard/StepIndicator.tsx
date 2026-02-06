/**
 * StepIndicator - Indicador visual dos passos do wizard
 * Permite navegação para passos anteriores e mostra tooltip com requisitos
 */

import { useState } from 'react';
import { IStepInfo, WizardStep } from '../shared/domain/types';

interface StepIndicatorProps {
  currentStep: WizardStep;
  steps: IStepInfo[];
  onStepClick?: (step: WizardStep) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<WizardStep | null>(null);

  const handleStepClick = (step: IStepInfo) => {
    // Allow navigation to completed steps and current step
    if (step.step <= currentStep && onStepClick) {
      onStepClick(step.step);
    }
  };

  return (
    <nav aria-label="Progresso" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isClickable = step.step <= currentStep;
          const isLast = index === steps.length - 1;
          const isHovered = hoveredStep === step.step;

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
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => handleStepClick(step)}
                  onMouseEnter={() => setHoveredStep(step.step)}
                  onMouseLeave={() => setHoveredStep(null)}
                  role="button"
                  tabIndex={isClickable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleStepClick(step);
                    }
                  }}
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

                  {/* Tooltip */}
                  {isHovered && step.requirements && step.requirements.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-max max-w-xs">
                      <div className="bg-cin-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <p className="font-semibold mb-1 text-cin-red/80">{step.title}</p>
                        <ul className="space-y-0.5">
                          {step.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-cin-red mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                          <div className="border-8 border-transparent border-t-cin-black" />
                        </div>
                      </div>
                    </div>
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
                    ${isCurrent ? 'text-cin-red' : isCompleted ? 'text-cin-red/70' : 'text-cin-black/60'}
                    ${isClickable ? 'cursor-pointer hover:underline' : ''}
                  `}
                  onClick={() => handleStepClick(step)}
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
