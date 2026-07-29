export interface IStudentData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  course: string;
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
  afternoon: IWorkPeriod;
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

  evaluationDeadline: string;
}

export interface IInternshipData {
  student: IStudentData;
  company: ICompanyData;
  general: IInternshipGeneral;
  content: IInternshipContent;
  evaluation: IEvaluationData;
  supervision: ISupervisionData;
}
