import type { InternshipRules } from "@papelada-estagio/constants/internshipRules";
import type {
  ICompanyData,
  IEvaluationData,
  IInternshipContent,
  IInternshipData,
  IInternshipFraming,
  IInternshipGeneral,
  IScheduleItem,
  IStudentData,
  ISupervisionData,
} from "./internship";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface IStepInfo {
  step: WizardStep;
  title: string;
  description: string;
  requirements?: string[];
}

export interface IChecklistStepProps {
  data: IInternshipFraming;
  onNext: (data: IInternshipFraming) => void;
}

export interface IStudentFormStepProps {
  data: IStudentData;
  onNext: (data: IStudentData) => void;
  onBack: () => void;
}

export interface ICompanyFormStepProps {
  data: ICompanyData;
  onNext: (data: ICompanyData) => void;
  onBack: () => void;
}

export interface IInternshipGeneralStepProps {
  data: IInternshipGeneral;
  rules: InternshipRules;
  onNext: (data: IInternshipGeneral) => void;
  onBack: () => void;
}

export interface IInternshipContentStepProps {
  data: IInternshipContent;
  evaluation: IEvaluationData;
  general: IInternshipGeneral;
  rules: InternshipRules;
  onNext: (data: IInternshipContent, evaluation: IEvaluationData) => void;
  onBack: () => void;
}

export interface ISupervisionFormStepProps {
  data: ISupervisionData;
  rules: InternshipRules;
  startDate: string;
  endDate: string;
  schedule: IScheduleItem[];
  onNext: (data: ISupervisionData) => void;
  onBack: () => void;
}

export interface IReviewStepProps {
  data: IInternshipData;
  rules: InternshipRules;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export interface IDownloadStepProps {
  data: IInternshipData;
  rules: InternshipRules;
  onBack: () => void;
}

export type IStep1Props = IChecklistStepProps;
export type IStep2Props = IStudentFormStepProps;
export type IStep3Props = ICompanyFormStepProps;
export type IStep4Props = IInternshipGeneralStepProps;
export type IStep5Props = IInternshipContentStepProps;
export type IStep6Props = ISupervisionFormStepProps;
export type IStep7Props = IReviewStepProps;
export type IStep8Props = IDownloadStepProps;
