import { Suspense, useMemo } from "react";
import { Button } from "../components";
import type { WizardDataActions, WizardDataState } from "../hooks";
import type { WizardStep } from "../types/types";
import { MobileStepPopover } from "./MobileStepPopover";
import { StepIndicator } from "./StepIndicator";
import { STEPS, TOTAL_STEPS } from "./data/steps";
import { STEP_REGISTRY } from "./stepRegistry";

function StepLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-border dark:border-border-dark border-t-cin-red rounded-full animate-spin" />
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          Carregando...
        </p>
      </div>
    </div>
  );
}

interface WizardContainerProps {
  state: WizardDataState;
  actions: WizardDataActions;
}

export function WizardContainer({ state, actions }: WizardContainerProps) {
  const { data, currentStep, completedSteps, isInitialized } = state;
  const {
    setCurrentStep,
    updateStudent,
    updateCompany,
    updateGeneral,
    updateContent,
    updateSupervision,
    nextStep,
    prevStep,
  } = actions;

  const goToStep = (step: WizardStep) => setCurrentStep(step);

  const stepProps = useMemo(() => {
    switch (currentStep) {
      case 1:
        return { onNext: nextStep };
      case 2:
        return { data: data.student, onNext: updateStudent };
      case 3:
        return { data: data.company, onNext: updateCompany, onBack: prevStep };
      case 4:
        return { data: data.general, onNext: updateGeneral, onBack: prevStep };
      case 5:
        return { data: data.content, onNext: updateContent, onBack: prevStep };
      case 6:
        return {
          data: data.supervision,
          onNext: updateSupervision,
          onBack: prevStep,
        };
      case 7:
        return {
          data,
          onNext: nextStep,
          onBack: prevStep,
          onEdit: (step: number) => goToStep(step as WizardStep),
        };
      case 8:
      default:
        return { data, onBack: prevStep };
    }
  }, [
    currentStep,
    data,
    nextStep,
    updateStudent,
    updateCompany,
    updateGeneral,
    updateContent,
    updateSupervision,
    prevStep,
  ]);

  const StepComponent = STEP_REGISTRY[currentStep];

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <StepLoading />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="md:hidden mb-4">
        <MobileStepPopover
          currentStep={currentStep}
          steps={STEPS}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-8">
            <StepIndicator
              currentStep={currentStep}
              steps={STEPS}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {(() => {
            const highestCompleted =
              completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
            const workingStep = Math.min(
              highestCompleted + 1,
              TOTAL_STEPS,
            ) as WizardStep;
            const workingStepInfo = STEPS.find((s) => s.step === workingStep);
            if (currentStep < workingStep && workingStepInfo) {
              return (
                <Button
                  onClick={() => goToStep(workingStep)}
                  variant="outline"
                  className="mb-4 w-full"
                >
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  Voltar para Passo {workingStep}: {workingStepInfo.title}
                </Button>
              );
            }
            return null;
          })()}
          <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6 md:p-8">
            <Suspense fallback={<StepLoading />}>
              <StepComponent {...(stepProps as any)} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
