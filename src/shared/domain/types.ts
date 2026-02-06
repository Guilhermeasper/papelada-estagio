// ============================================
// Domain Types - Internship Document Generator
// ============================================

// Passo 1: Dados do Aluno
export interface IStudentData {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  course: string;
  enrollmentYear: string;
  studentId: string;
}

// Passo 2: Dados da Empresa
export interface ICompanyData {
  companyName: string;
  companyAddress: string;
  companyCnpj: string;
}

// Passo 3: Informações Gerais do Estágio
export interface IInternshipGeneral {
  startDate: string;           // ISO format (YYYY-MM-DD)
  endDate: string;             // ISO format - calculado automaticamente
  hoursPerDay: number;         // Ex: 6, 8
  workDays: string;            // "Segunda a Sexta"
  workSchedule: string;        // "9:00-12:00 e 13:00-18:00"
  modality: 'Remoto' | 'Presencial' | 'Híbrido';
}

// Item do cronograma
export interface IScheduleItem {
  period: string;              // Ex: "20/11/2025 a 30/11/2025"
  description: string;         // Descrição das atividades do período
}

// Passo 4: Conteúdo do Estágio
export interface IInternshipContent {
  activities: string[];        // Mínimo 1 item
  objectives: string[];        // Mínimo 1 item
  schedule: IScheduleItem[];   // Cronograma
  introduction: string;
  generalObjectives: string;
  specificObjectives: string;
  methodology: string;
  development: string;
  conclusion: string;
}

// Item da tabela de avaliação
export interface IEvaluationGrade {
  item: string;
  grade: number;
  observation: string;
}

// Dados de avaliação (notas e sim/não)
export interface IEvaluationData {
  grades: IEvaluationGrade[];
  flexibleSchedule: boolean;
  reducedDuringExams: boolean;
  requiresCompensation: boolean;
  caresAboutAcademics: boolean;
  recommendsPartnership: boolean;
}

// Passo 5: Supervisão e Orientação
export interface ISupervisionData {
  // Supervisor da Empresa
  supervisorName: string;
  supervisorEmail: string;
  supervisorPhone: string;
  supervisorPosition: string;
  supervisorCpf: string;
  // Professor Orientador
  advisorName: string;
  advisorEmail: string;
  advisorSiape: string;
  advisorPosition: string;
}

// Aggregate Root - Todos os dados do estágio
export interface IInternshipData {
  student: IStudentData;
  company: ICompanyData;
  general: IInternshipGeneral;
  content: IInternshipContent;
  evaluation: IEvaluationData;
  supervision: ISupervisionData;
}

// Interface para geradores de documentos (Strategy Pattern)
export interface IDocumentGenerator {
  id: string;
  label: string;
  description: string;
  generate(data: IInternshipData): Promise<Uint8Array>;
}

// Tipo para os passos do wizard
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Informação de cada passo
export interface IStepInfo {
  step: WizardStep;
  title: string;
  description: string;
  requirements?: string[];  // Bullet points shown on hover
}

// Documentos disponíveis para geração
export type DocumentType = 'report' | 'activity-plan' | 'advisor-eval' | 'supervisor-eval';

export interface IDocumentOption {
  id: DocumentType;
  label: string;
  description: string;
  filename: string;
}
