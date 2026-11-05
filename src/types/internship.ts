import type {
  Course,
  CurriculumProfile,
  InternshipRegime,
} from "@papelada-estagio/constants/internshipRules";

export type { Course, CurriculumProfile, InternshipRegime };

export interface IInternshipFraming {
  course: Course | "";
  curriculumProfile: CurriculumProfile | "";
  regime: InternshipRegime | "";
  declaredRequiredHours: number | null;
}

export interface IStudentData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  enrollmentYear: string;
  studentId: string;
}

export interface ICompanyData {
  companyName: string;
  companyAddress: string;
  companyCnpj: string;
}

export interface IWorkPeriod {
  start: number;
  end: number;
}

export interface IWorkSchedule {
  morning: IWorkPeriod;
  afternoon: IWorkPeriod | null;
}

export interface IInternshipGeneral {
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  workDays: number[];
  workSchedule: IWorkSchedule;
  modality: "Remoto" | "Presencial" | "Híbrido";
}

export interface IScheduleItem {
  periodStart: string;
  periodEnd: string;
  description: string;
}

export interface IInternshipContent {
  activities: string[];
  objectives: string[];
  schedule: IScheduleItem[];
  introduction: string;
  generalObjectives: string;
  specificObjectives: string;
  scheduleDiscussion: string;
  methodology: string;
  development: string;
  conclusion: string;
  references: string;
}

export interface IEvaluationGrade {
  item: string;
  grade: number | null;
  observation: string;
}

export interface IEvaluationAnswer {
  answer: boolean | null;
  comment: string;
}

export interface IEvaluationData {
  grades: IEvaluationGrade[];
  flexibleSchedule: IEvaluationAnswer;
  reducedDuringExams: IEvaluationAnswer;
  requiresCompensation: IEvaluationAnswer;
  caresAboutAcademics: IEvaluationAnswer;
  recommendsPartnership: IEvaluationAnswer;
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

  evaluationDeadline: string;
  goalsCompletionDate: string;
}

export interface IInternshipData {
  framing: IInternshipFraming;
  student: IStudentData;
  company: ICompanyData;
  general: IInternshipGeneral;
  content: IInternshipContent;
  evaluation: IEvaluationData;
  supervision: ISupervisionData;
}
