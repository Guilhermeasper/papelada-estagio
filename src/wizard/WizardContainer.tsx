import { Button } from "@papelada-estagio/components";
import { resolveInternshipRules } from "@papelada-estagio/constants/internshipRules";
import type {
  WizardDataActions,
  WizardDataState,
} from "@papelada-estagio/hooks";
import type { WizardStep } from "@papelada-estagio/types";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { MobileStepPopover } from "./MobileStepPopover";
import { StepIndicator } from "./StepIndicator";
import { TOTAL_STEPS, useSteps } from "./data/steps";
import {
  ChecklistStep,
  CompanyFormStep,
  DownloadStep,
  InternshipContentStep,
  InternshipGeneralStep,
  ReviewStep,
  StudentFormStep,
  SupervisionFormStep,
} from "./stepRegistry";

function StepLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-border dark:border-border-dark border-t-brand-accent rounded-full animate-spin" />
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
          {t("app.loading")}
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
  const { t } = useTranslation();
  const steps = useSteps();
  const { data, currentStep, completedSteps } = state;
  const {
    setCurrentStep,
    updateFraming,
    updateStudent,
    updateCompany,
    updateGeneral,
    updateContent,
    updateSupervision,
    nextStep,
    prevStep,
  } = actions;

  const rules = resolveInternshipRules(data.framing);

  const renderStep = () => {
    // Todos os outros passos dependem das regras do enquadramento, como em dados
    // salvos de um curso sem estágio obrigatório.
    if (currentStep === 1 || !rules) {
      return <ChecklistStep data={data.framing} onNext={updateFraming} />;
    }

    switch (currentStep) {
      case 2:
        return (
          <StudentFormStep
            data={data.student}
            onNext={updateStudent}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <CompanyFormStep
            data={data.company}
            onNext={updateCompany}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <InternshipGeneralStep
            data={data.general}
            rules={rules}
            onNext={updateGeneral}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <InternshipContentStep
            data={data.content}
            general={data.general}
            onNext={updateContent}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <SupervisionFormStep
            data={data.supervision}
            endDate={data.general.endDate}
            onNext={updateSupervision}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <ReviewStep
            data={data}
            rules={rules}
            onNext={nextStep}
            onBack={prevStep}
            onEdit={(step) => setCurrentStep(step as WizardStep)}
          />
        );
      case 8:
        return <DownloadStep data={data} onBack={prevStep} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="md:hidden sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-surface dark:bg-surface-dark">
        <MobileStepPopover
          currentStep={currentStep}
          steps={steps}
          completedSteps={completedSteps}
          onStepClick={setCurrentStep}
        />
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-8">
            <StepIndicator
              currentStep={currentStep}
              steps={steps}
              completedSteps={completedSteps}
              onStepClick={setCurrentStep}
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
            const workingStepInfo = steps.find((s) => s.step === workingStep);
            if (currentStep < workingStep && workingStepInfo) {
              return (
                <Button
                  onClick={() => setCurrentStep(workingStep)}
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
                  {t("steps.backToStep", {
                    step: workingStep,
                    title: workingStepInfo.title,
                  })}
                </Button>
              );
            }
            return null;
          })()}
          <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6 md:p-8">
            <Suspense fallback={<StepLoading />}>{renderStep()}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
