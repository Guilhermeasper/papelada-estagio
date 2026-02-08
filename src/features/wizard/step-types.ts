import type {
  ICompanyData,
  IInternshipContent,
  IInternshipData,
  IInternshipGeneral,
  IStudentData,
  ISupervisionData
} from '../../types/types';

export interface IChecklistStepProps {
  onNext: () => void;
}

export interface IStudentFormStepProps {
  data: IStudentData;
  onNext: (data: IStudentData) => void;
}

export interface ICompanyFormStepProps {
  data: ICompanyData;
  onNext: (data: ICompanyData) => void;
  onBack: () => void;
}

export interface IInternshipGeneralStepProps {
  data: IInternshipGeneral;
  onNext: (data: IInternshipGeneral) => void;
  onBack: () => void;
}

export interface IInternshipContentStepProps {
  data: IInternshipContent;
  onNext: (data: IInternshipContent) => void;
  onBack: () => void;
}

export interface ISupervisionFormStepProps {
  data: ISupervisionData;
  onNext: (data: ISupervisionData) => void;
  onBack: () => void;
}

export interface IReviewStepProps {
  data: IInternshipData;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export interface IDownloadStepProps {
  data: IInternshipData;
  onBack: () => void;
}


export type StepPropsMap = {
  1: IChecklistStepProps;
  2: IStudentFormStepProps;
  3: ICompanyFormStepProps;
  4: IInternshipGeneralStepProps;
  5: IInternshipContentStepProps;
  6: ISupervisionFormStepProps;
  7: IReviewStepProps;
  8: IDownloadStepProps;
};


export type IStep1Props = IChecklistStepProps;
export type IStep2Props = IStudentFormStepProps;
export type IStep3Props = ICompanyFormStepProps;
export type IStep4Props = IInternshipGeneralStepProps;
export type IStep5Props = IInternshipContentStepProps;
export type IStep6Props = ISupervisionFormStepProps;
export type IStep7Props = IReviewStepProps;
export type IStep8Props = IDownloadStepProps;
