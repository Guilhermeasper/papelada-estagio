/**
 * Zod Validation Schemas
 * Schemas de validação para cada passo do wizard
 */

import { z } from 'zod';
import { validateDate, validateInternshipPeriod } from '../../shared/utils/dateCalculator';

// Regex patterns
const phoneRegex = /^\(?[0-9]{2}\)?[\s]?[0-9]{4,5}[-\s]?[0-9]{4}$/;
const cnpjRegex = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/;
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// Passo 1: Dados do Aluno
// ============================================
export const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .regex(emailRegex, 'E-mail inválido'),
  address: z
    .string()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  phone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido. Ex: (81) 98888-7777'),
  course: z
    .string()
    .min(3, 'Curso é obrigatório'),
  enrollmentYear: z
    .string()
    .regex(/^[0-9]{4}\.[1-2]$/, 'Formato inválido. Use: AAAA.S (ex: 2018.2)'),
  studentId: z
    .string()
    .min(5, 'Matrícula é obrigatória'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// ============================================
// Passo 2: Dados da Empresa
// ============================================
export const companySchema = z.object({
  companyName: z
    .string()
    .min(2, 'Nome da empresa é obrigatório'),
  companyAddress: z
    .string()
    .min(10, 'Endereço da empresa é obrigatório'),
  companyCnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido. Ex: 00.000.000/0000-00'),
});

export type CompanyFormData = z.infer<typeof companySchema>;

// ============================================
// Passo 3: Informações Gerais do Estágio
// ============================================
export const internshipGeneralSchema = z.object({
  startDate: z
    .string()
    .min(1, 'Data de início é obrigatória')
    .refine(
      (date) => {
        const validation = validateDate(date);
        return validation.valid;
      },
      {
        message: 'Data de início inválida (fim de semana ou feriado)',
      }
    ),
  endDate: z
    .string()
    .min(1, 'Data de término é obrigatória')
    .refine(
      (date) => {
        const validation = validateDate(date);
        return validation.valid;
      },
      {
        message: 'Data de término inválida (fim de semana ou feriado)',
      }
    ),
  hoursPerDay: z
    .number()
    .min(1, 'Mínimo 1 hora por dia')
    .max(8, 'Máximo 8 horas por dia'),
  workDays: z
    .string()
    .min(1, 'Dias de trabalho é obrigatório'),
  workSchedule: z
    .string()
    .min(1, 'Horário de trabalho é obrigatório'),
  modality: z.enum(['Remoto', 'Presencial', 'Híbrido'], {
    message: 'Selecione a modalidade',
  }),
}).superRefine((data, ctx) => {
  if (!data.startDate || !data.endDate || !data.hoursPerDay) return;
  
  const validation = validateInternshipPeriod(
    data.startDate,
    data.endDate,
    data.hoursPerDay
  );
  
  if (!validation.valid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validation.error || 'Período inválido',
      path: ['endDate'],
    });
  }
});

export type InternshipGeneralFormData = z.infer<typeof internshipGeneralSchema>;

// ============================================
// Passo 4: Conteúdo do Estágio
// ============================================
export const scheduleItemSchema = z.object({
  period: z.string().min(1, 'Período é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

export const evaluationGradeSchema = z.object({
  item: z.string(),
  grade: z.number().min(0).max(10),
  observation: z.string(),
});

export const internshipContentSchema = z.object({
  activities: z
    .array(z.string().min(5, 'Atividade deve ter pelo menos 5 caracteres'))
    .min(1, 'Adicione pelo menos 1 atividade'),
  objectives: z
    .array(z.string().min(5, 'Objetivo deve ter pelo menos 5 caracteres'))
    .min(1, 'Adicione pelo menos 1 objetivo'),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, 'Adicione pelo menos 1 item no cronograma'),
  introduction: z
    .string()
    .min(50, 'Introdução deve ter pelo menos 50 caracteres'),
  generalObjectives: z
    .string()
    .min(30, 'Objetivos gerais devem ter pelo menos 30 caracteres'),
  specificObjectives: z
    .string()
    .min(30, 'Objetivos específicos devem ter pelo menos 30 caracteres'),
  methodology: z
    .string()
    .min(30, 'Metodologia deve ter pelo menos 30 caracteres'),
  development: z
    .string()
    .min(50, 'Desenvolvimento deve ter pelo menos 50 caracteres'),
  conclusion: z
    .string()
    .min(30, 'Conclusão deve ter pelo menos 30 caracteres'),
});

export const evaluationSchema = z.object({
  grades: z.array(evaluationGradeSchema),
  flexibleSchedule: z.boolean(),
  reducedDuringExams: z.boolean(),
  requiresCompensation: z.boolean(),
  caresAboutAcademics: z.boolean(),
  recommendsPartnership: z.boolean(),
});

export type InternshipContentFormData = z.infer<typeof internshipContentSchema>;
export type EvaluationFormData = z.infer<typeof evaluationSchema>;

// ============================================
// Passo 5: Supervisão e Orientação
// ============================================
export const supervisionSchema = z.object({
  // Supervisor
  supervisorName: z
    .string()
    .min(3, 'Nome do supervisor é obrigatório'),
  supervisorEmail: z
    .string()
    .regex(emailRegex, 'E-mail inválido'),
  supervisorPhone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido'),
  supervisorPosition: z
    .string()
    .min(2, 'Cargo é obrigatório'),
  supervisorCpf: z
    .string()
    .regex(cpfRegex, 'CPF inválido. Ex: 000.000.000-00'),
  // Professor Orientador
  advisorName: z
    .string()
    .min(3, 'Nome do professor é obrigatório'),
  advisorEmail: z
    .string()
    .regex(emailRegex, 'E-mail inválido'),
  advisorSiape: z
    .string()
    .min(5, 'SIAPE é obrigatório'),
  advisorPosition: z
    .string()
    .min(2, 'Cargo é obrigatório'),
});

export type SupervisionFormData = z.infer<typeof supervisionSchema>;

// ============================================
// Schema Completo (para referência)
// ============================================
export const fullInternshipSchema = z.object({
  student: studentSchema,
  company: companySchema,
  general: internshipGeneralSchema,
  content: internshipContentSchema,
  evaluation: evaluationSchema,
  supervision: supervisionSchema,
});

export type FullInternshipData = z.infer<typeof fullInternshipSchema>;

// ============================================
// Import/Export Schemas (lenient validation)
// ============================================

// Lenient student schema for import (structure only, no min lengths)
const studentImportSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  address: z.string(),
  phone: z.string(),
  course: z.string(),
  enrollmentYear: z.string(),
  studentId: z.string(),
});

// Lenient company schema for import
const companyImportSchema = z.object({
  companyName: z.string(),
  companyAddress: z.string(),
  companyCnpj: z.string(),
});

// Lenient general schema for import
const generalImportSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  hoursPerDay: z.number(),
  workDays: z.string(),
  workSchedule: z.string(),
  modality: z.enum(['Remoto', 'Presencial', 'Híbrido']),
});

// Lenient schedule item for import (no min length)
const scheduleItemImportSchema = z.object({
  period: z.string(),
  description: z.string(),
});

// Lenient content schema for import
const contentImportSchema = z.object({
  activities: z.array(z.string()),
  objectives: z.array(z.string()),
  schedule: z.array(scheduleItemImportSchema),
  introduction: z.string(),
  generalObjectives: z.string(),
  specificObjectives: z.string(),
  methodology: z.string(),
  development: z.string(),
  conclusion: z.string(),
});

// Lenient supervision schema for import
const supervisionImportSchema = z.object({
  supervisorName: z.string(),
  supervisorEmail: z.string(),
  supervisorPhone: z.string(),
  supervisorPosition: z.string(),
  supervisorCpf: z.string(),
  advisorName: z.string(),
  advisorEmail: z.string(),
  advisorSiape: z.string(),
  advisorPosition: z.string(),
});

// Full lenient data schema for import
const importDataSchema = z.object({
  student: studentImportSchema,
  company: companyImportSchema,
  general: generalImportSchema,
  content: contentImportSchema,
  evaluation: evaluationSchema,
  supervision: supervisionImportSchema,
});

// Persisted state schema for import validation
export const persistedStateSchema = z.object({
  data: importDataSchema,
  currentStep: z.number().min(1).max(8),
  completedSteps: z.array(z.number().min(1).max(8)),
  savedAt: z.string(),
});

export type PersistedStateImport = z.infer<typeof persistedStateSchema>;
