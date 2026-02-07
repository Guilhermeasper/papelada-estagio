/**
 * Step Registry - Lazy loaded wizard step components
 * Implements registry pattern for better extensibility and code splitting
 */

import { ComponentType, lazy, LazyExoticComponent, ReactNode, Suspense } from 'react';
import {
    ICompanyData,
    IInternshipContent,
    IInternshipData,
    IInternshipGeneral,
    IStudentData,
    ISupervisionData,
    WizardStep
} from '../shared/domain/types';

// Step component prop types
interface Step0Props {
  onNext: () => void;
}

interface Step1Props {
  data: IStudentData;
  onNext: (data: IStudentData) => void;
}

interface Step2Props {
  data: ICompanyData;
  onNext: (data: ICompanyData) => void;
  onBack: () => void;
}

interface Step3Props {
  data: IInternshipGeneral;
  onNext: (data: IInternshipGeneral) => void;
  onBack: () => void;
}

interface Step4Props {
  data: IInternshipContent;
  onNext: (data: IInternshipContent) => void;
  onBack: () => void;
}

interface Step5Props {
  data: ISupervisionData;
  onNext: (data: ISupervisionData) => void;
  onBack: () => void;
}

interface Step6Props {
  data: IInternshipData;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

interface Step7Props {
  data: IInternshipData;
  onBack: () => void;
}

// Union type for all step props
type StepProps = Step0Props | Step1Props | Step2Props | Step3Props | Step4Props | Step5Props | Step6Props | Step7Props;

// Lazy load step components for code splitting
const Step0_Checklist = lazy(() => 
  import('./steps/Step0_Checklist').then(m => ({ default: m.Step0_Checklist }))
);
const Step1_StudentForm = lazy(() => 
  import('./steps/Step1_StudentForm').then(m => ({ default: m.Step1_StudentForm }))
);
const Step2_CompanyForm = lazy(() => 
  import('./steps/Step2_CompanyForm').then(m => ({ default: m.Step2_CompanyForm }))
);
const Step3_InternshipGeneral = lazy(() => 
  import('./steps/Step3_InternshipGeneral').then(m => ({ default: m.Step3_InternshipGeneral }))
);
const Step4_InternshipContent = lazy(() => 
  import('./steps/Step4_InternshipContent').then(m => ({ default: m.Step4_InternshipContent }))
);
const Step5_SupervisionForm = lazy(() => 
  import('./steps/Step5_SupervisionForm').then(m => ({ default: m.Step5_SupervisionForm }))
);
const Step6_ReviewStep = lazy(() => 
  import('./steps/Step6_ReviewStep').then(m => ({ default: m.Step6_ReviewStep }))
);
const Step7_DownloadStep = lazy(() => 
  import('./steps/Step7_DownloadStep').then(m => ({ default: m.Step7_DownloadStep }))
);

// Registry of step components
export const STEP_REGISTRY: Record<WizardStep, LazyExoticComponent<ComponentType<StepProps>>> = {
  1: Step0_Checklist as LazyExoticComponent<ComponentType<StepProps>>,
  2: Step1_StudentForm as LazyExoticComponent<ComponentType<StepProps>>,
  3: Step2_CompanyForm as LazyExoticComponent<ComponentType<StepProps>>,
  4: Step3_InternshipGeneral as LazyExoticComponent<ComponentType<StepProps>>,
  5: Step4_InternshipContent as LazyExoticComponent<ComponentType<StepProps>>,
  6: Step5_SupervisionForm as LazyExoticComponent<ComponentType<StepProps>>,
  7: Step6_ReviewStep as LazyExoticComponent<ComponentType<StepProps>>,
  8: Step7_DownloadStep as LazyExoticComponent<ComponentType<StepProps>>,
};

// Loading fallback component
function StepLoading(): ReactNode {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-border dark:border-border-dark border-t-cin-red rounded-full animate-spin" />
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">Carregando...</p>
      </div>
    </div>
  );
}

// Wrapper component for lazy loaded steps
interface StepWrapperProps {
  step: WizardStep;
  props: StepProps;
}

export function LazyStepWrapper({ step, props }: StepWrapperProps): ReactNode {
  const StepComponent = STEP_REGISTRY[step];
  
  return (
    <Suspense fallback={<StepLoading />}>
      <StepComponent {...props} />
    </Suspense>
  );
}
