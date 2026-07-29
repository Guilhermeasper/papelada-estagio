import {
  MAX_HOURS_PER_DAY,
  MAX_WEEKDAY,
  MIN_HOURS_PER_DAY,
  MIN_WEEKDAY,
} from "@papelada-estagio/constants";
import type { IInternshipGeneral } from "@papelada-estagio/types";
import {
  validateDate,
  validateInternshipPeriod,
} from "@papelada-estagio/utils/dateCalculator";
import {
  formatDatePtBr,
  getDayOfWeekPtBr,
  isWeekend,
  parseIsoDate,
} from "@papelada-estagio/utils/dateUtils";
import { isHoliday } from "@papelada-estagio/utils/holidays";
import { isValidWorkSchedule } from "@papelada-estagio/utils/workSchedule";
import { z } from "zod";

const workPeriodSchema = z.object({
  start: z.number(),
  end: z.number(),
});

const workScheduleSchema = z.object({
  morning: workPeriodSchema,
  afternoon: workPeriodSchema,
});

const phoneRegex = /^\(?[0-9]{2}\)?[\s]?[0-9]{4,5}[-\s]?[0-9]{4}$/;
const cnpjRegex = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2}$/;
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().regex(emailRegex, "E-mail inválido"),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  phone: z.string().regex(phoneRegex, "Telefone inválido. Ex: (81) 98888-7777"),
  course: z.string().min(3, "Curso é obrigatório"),
  enrollmentYear: z
    .string()
    .regex(/^[0-9]{4}\.[1-2]$/, "Formato inválido. Use: AAAA.S (ex: 2018.2)"),
  studentId: z.string().min(5, "Matrícula é obrigatória"),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const companySchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  companyAddress: z.string().min(10, "Endereço da empresa é obrigatório"),
  companyCnpj: z
    .string()
    .regex(cnpjRegex, "CNPJ inválido. Ex: 00.000.000/0000-00"),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const internshipGeneralSchema = z
  .object({
    startDate: z
      .string()
      .min(1, "Data de início é obrigatória")
      .refine(
        (date) => {
          const validation = validateDate(date);
          return validation.valid;
        },
        {
          message: "Data de início inválida (fim de semana ou feriado)",
        },
      ),
    endDate: z
      .string()
      .min(1, "Data de término é obrigatória")
      .refine(
        (date) => {
          const validation = validateDate(date);
          return validation.valid;
        },
        {
          message: "Data de término inválida (fim de semana ou feriado)",
        },
      ),
    hoursPerDay: z
      .number()
      .min(MIN_HOURS_PER_DAY, `Mínimo ${MIN_HOURS_PER_DAY} horas por dia`)
      .max(MAX_HOURS_PER_DAY, `Máximo ${MAX_HOURS_PER_DAY} horas por dia`),
    workDays: z
      .array(z.number().int().min(MIN_WEEKDAY).max(MAX_WEEKDAY))
      .min(1, "Selecione pelo menos 1 dia"),
    workSchedule: workScheduleSchema,
    modality: z.enum(["Remoto", "Presencial", "Híbrido"], {
      message: "Selecione a modalidade",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.hoursPerDay) return;

    if (!isValidWorkSchedule(data.workSchedule, data.hoursPerDay * 60)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `O horário deve somar ${data.hoursPerDay}h por dia`,
        path: ["workSchedule"],
      });
    }

    if (!data.startDate || !data.endDate) return;

    if (
      data.workDays.length > 0 &&
      !data.workDays.includes(parseIsoDate(data.startDate).getDay())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data de início deve cair em um dia de trabalho selecionado",
        path: ["startDate"],
      });
      return;
    }

    const validation = validateInternshipPeriod(
      data.startDate,
      data.endDate,
      data.hoursPerDay,
      data.workDays,
    );

    if (!validation.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validation.error || "Período inválido",
        path: ["endDate"],
      });
    }
  });

export type InternshipGeneralFormData = z.infer<typeof internshipGeneralSchema>;

export const scheduleItemSchema = z
  .object({
    periodStart: z.string().min(1, "Data de início é obrigatória"),
    periodEnd: z.string().min(1, "Data de término é obrigatória"),
    description: z
      .string()
      .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  })
  .superRefine((item, ctx) => {
    if (!item.periodStart || !item.periodEnd) return;

    if (parseIsoDate(item.periodEnd) < parseIsoDate(item.periodStart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data de término deve ser posterior à data de início",
        path: ["periodEnd"],
      });
    }
  });

export const evaluationGradeSchema = z.object({
  item: z.string(),
  grade: z.number().min(0).max(10),
  observation: z.string(),
});

export const internshipContentSchema = z.object({
  activities: z
    .array(z.string().min(5, "Atividade deve ter pelo menos 5 caracteres"))
    .min(1, "Adicione pelo menos 1 atividade"),
  objectives: z
    .array(z.string().min(5, "Objetivo deve ter pelo menos 5 caracteres"))
    .min(1, "Adicione pelo menos 1 objetivo"),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, "Adicione pelo menos 1 item no cronograma"),
  introduction: z
    .string()
    .min(50, "Introdução deve ter pelo menos 50 caracteres"),
  generalObjectives: z
    .string()
    .min(30, "Objetivos gerais devem ter pelo menos 30 caracteres"),
  specificObjectives: z
    .string()
    .min(30, "Objetivos específicos devem ter pelo menos 30 caracteres"),
  methodology: z
    .string()
    .min(30, "Metodologia deve ter pelo menos 30 caracteres"),
  development: z
    .string()
    .min(50, "Desenvolvimento deve ter pelo menos 50 caracteres"),
  conclusion: z.string().min(30, "Conclusão deve ter pelo menos 30 caracteres"),
});

export type ScheduleBounds = Pick<
  IInternshipGeneral,
  "startDate" | "endDate" | "workDays"
>;

function getScheduleDateIssue(
  date: Date,
  workDays: number[],
): string | null {
  const holiday = isHoliday(date);
  if (holiday.isHoliday) return `Data inválida: ${holiday.name}`;

  if (isWeekend(date)) {
    return `Data inválida: ${getDayOfWeekPtBr(date)} é fim de semana`;
  }

  if (!workDays.includes(date.getDay())) {
    return `${getDayOfWeekPtBr(date)} não é um dia de trabalho selecionado`;
  }

  return null;
}

export function makeInternshipContentSchema({
  startDate,
  endDate,
  workDays,
}: ScheduleBounds) {
  return internshipContentSchema.superRefine((content, ctx) => {
    if (!startDate || !endDate || workDays.length === 0) return;

    const min = parseIsoDate(startDate);
    const max = parseIsoDate(endDate);
    const range = `${formatDatePtBr(startDate)} e ${formatDatePtBr(endDate)}`;

    content.schedule.forEach((item, index) => {
      (["periodStart", "periodEnd"] as const).forEach((key) => {
        const value = item[key];
        if (!value) return;

        const addIssue = (message: string) =>
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
            path: ["schedule", index, key],
          });

        const date = parseIsoDate(value);
        if (Number.isNaN(date.getTime())) {
          addIssue("Data inválida");
          return;
        }

        if (date < min || date > max) {
          addIssue(`A data deve estar entre ${range}`);
          return;
        }

        const issue = getScheduleDateIssue(date, workDays);
        if (issue) addIssue(issue);
      });
    });
  });
}

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

export const supervisionSchema = z.object({
  supervisorName: z.string().min(3, "Nome do supervisor é obrigatório"),
  supervisorEmail: z.string().regex(emailRegex, "E-mail inválido"),
  supervisorPhone: z.string().regex(phoneRegex, "Telefone inválido"),
  supervisorPosition: z.string().min(2, "Cargo é obrigatório"),
  supervisorCpf: z.string().regex(cpfRegex, "CPF inválido. Ex: 000.000.000-00"),

  advisorName: z.string().min(3, "Nome do professor é obrigatório"),
  advisorEmail: z.string().regex(emailRegex, "E-mail inválido"),
  advisorSiape: z.string().min(5, "SIAPE é obrigatório"),
  advisorPosition: z.string().min(2, "Cargo é obrigatório"),

  evaluationDeadline: z
    .string()
    .min(1, "Data para emissão do parecer é obrigatória"),
});

export type SupervisionFormData = z.infer<typeof supervisionSchema>;

export const fullInternshipSchema = z.object({
  student: studentSchema,
  company: companySchema,
  general: internshipGeneralSchema,
  content: internshipContentSchema,
  evaluation: evaluationSchema,
  supervision: supervisionSchema,
});

export type FullInternshipData = z.infer<typeof fullInternshipSchema>;

const studentImportSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  address: z.string(),
  phone: z.string(),
  course: z.string(),
  enrollmentYear: z.string(),
  studentId: z.string(),
});

const companyImportSchema = z.object({
  companyName: z.string(),
  companyAddress: z.string(),
  companyCnpj: z.string(),
});

const generalImportSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  hoursPerDay: z.number(),
  workDays: z.array(z.number()),
  workSchedule: workScheduleSchema,
  modality: z.enum(["Remoto", "Presencial", "Híbrido"]),
});

const scheduleItemImportSchema = z.object({
  periodStart: z.string().catch(""),
  periodEnd: z.string().catch(""),
  description: z.string().catch(""),
});

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
  evaluationDeadline: z.string(),
});

const importDataSchema = z.object({
  student: studentImportSchema,
  company: companyImportSchema,
  general: generalImportSchema,
  content: contentImportSchema,
  evaluation: evaluationSchema,
  supervision: supervisionImportSchema,
});

export const persistedStateSchema = z.object({
  version: z.number().optional(),
  data: importDataSchema,
  currentStep: z.number().min(1).max(8),
  completedSteps: z.array(z.number().min(1).max(8)),
  savedAt: z.string(),
});

export type PersistedStateImport = z.infer<typeof persistedStateSchema>;
