


export interface IStudentData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  course: string;
  enrollmentYear: string;
  studentId: string;
}


export type ICompanyData = 
  | {
      locationType: 'BR';
      companyName: string;
      companyAddress: string;
      companyCnpj: string;
    }
  | {
      locationType: 'INTL';
      companyName: string;
      companyAddress: string;
      companyTaxId: string;
    };


export interface IInternshipGeneral {
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  workDays: string;
  workSchedule: string;
  modality: 'Remoto' | 'Presencial' | 'Híbrido';
}


export interface IScheduleItem {
  period: string;
  description: string;
}


export interface IInternshipContent {
  activities: string[];
  objectives: string[];
  schedule: IScheduleItem[];
  introduction: string;
  generalObjectives: string;
  specificObjectives: string;
  methodology: string;
  development: string;
  conclusion: string;
}


export interface IEvaluationGrade {
  item: string;
  grade: number;
  observation: string;
}


export interface IEvaluationData {
  grades: IEvaluationGrade[];
  flexibleSchedule: boolean;
  reducedDuringExams: boolean;
  requiresCompensation: boolean;
  caresAboutAcademics: boolean;
  recommendsPartnership: boolean;
}


export interface ISupervisionData {

  supervisorName: string;
  supervisorEmail: string;
  supervisorPhone: string;
  supervisorPosition: string;
  supervisorCpf: string;

  advisorName: string;
  advisorEmail: string;
  advisorSiape: string;
  advisorPosition: string;
}


export interface IInternshipData {
  student: IStudentData;
  company: ICompanyData;
  general: IInternshipGeneral;
  content: IInternshipContent;
  evaluation: IEvaluationData;
  supervision: ISupervisionData;
}


export interface IDocumentGenerator {
  id: string;
  label: string;
  description: string;
  generate(data: IInternshipData): Promise<Uint8Array>;
}


export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;


export interface IStepInfo {
  step: WizardStep;
  title: string;
  description: string;
  requirements?: string[];
}


export type DocumentType = 'report' | 'activity-plan' | 'advisor-eval' | 'supervisor-eval';

export interface IDocumentOption {
  id: DocumentType;
  label: string;
  description: string;
  filename: string;
}
