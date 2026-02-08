import {
  ComponentType,
  lazy,
  LazyExoticComponent,
  ReactNode,
  Suspense,
} from "react";
import type { WizardStep } from "../types/types";
import type { StepPropsMap } from "./step-types";

const ChecklistStep = lazy(() =>
  import("./steps/ChecklistStep").then((m) => ({ default: m.ChecklistStep })),
);
const StudentFormStep = lazy(() =>
  import("./steps/StudentFormStep").then((m) => ({
    default: m.StudentFormStep,
  })),
);
const CompanyFormStep = lazy(() =>
  import("./steps/CompanyFormStep").then((m) => ({
    default: m.CompanyFormStep,
  })),
);
const InternshipGeneralStep = lazy(() =>
  import("./steps/InternshipGeneralStep").then((m) => ({
    default: m.InternshipGeneralStep,
  })),
);
const InternshipContentStep = lazy(() =>
  import("./steps/InternshipContentStep").then((m) => ({
    default: m.InternshipContentStep,
  })),
);
const SupervisionFormStep = lazy(() =>
  import("./steps/SupervisionFormStep").then((m) => ({
    default: m.SupervisionFormStep,
  })),
);
const ReviewStep = lazy(() =>
  import("./steps/ReviewStep").then((m) => ({ default: m.ReviewStep })),
);
const DownloadStep = lazy(() =>
  import("./steps/DownloadStep").then((m) => ({ default: m.DownloadStep })),
);

type StepRegistryMap = {
  [K in WizardStep]: LazyExoticComponent<ComponentType<StepPropsMap[K]>>;
};

export const STEP_REGISTRY: StepRegistryMap = {
  1: ChecklistStep,
  2: StudentFormStep,
  3: CompanyFormStep,
  4: InternshipGeneralStep,
  5: InternshipContentStep,
  6: SupervisionFormStep,
  7: ReviewStep,
  8: DownloadStep,
};

function StepLoading(): ReactNode {
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

export interface StepWrapperProps<K extends WizardStep> {
  step: K;
  props: StepPropsMap[K];
}

export function LazyStepWrapper<K extends WizardStep>({
  step,
  props,
}: StepWrapperProps<K>): ReactNode {
  const StepComponent = STEP_REGISTRY[step] as LazyExoticComponent<
    ComponentType<StepPropsMap[K]>
  >;

  return (
    <Suspense fallback={<StepLoading />}>
      <StepComponent {...props} />
    </Suspense>
  );
}
