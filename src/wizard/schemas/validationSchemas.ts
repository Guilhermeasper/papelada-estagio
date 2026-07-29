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
import { isValidIsoDate } from "@papelada-estagio/utils/scheduleRanges";
import { isValidWorkSchedule } from "@papelada-estagio/utils/workSchedule";
import { z } from "zod";
import i18n from "../../i18n";

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
    .min(3, i18n.t("validation.nameMin"))
    .max(100, i18n.t("validation.nameMax")),
  email: z.string().regex(emailRegex, i18n.t("validation.invalidEmail")),
  address: z.string().min(10, i18n.t("validation.addressMin")),
  phone: z.string().regex(phoneRegex, i18n.t("validation.invalidPhone")),
  course: z.string().min(3, i18n.t("validation.courseRequired")),
  enrollmentYear: z
    .string()
    .regex(/^[0-9]{4}\.[1-2]$/, i18n.t("validation.invalidEnrollmentYear")),
  studentId: z.string().min(5, i18n.t("validation.studentIdRequired")),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const companySchema = z.object({
  companyName: z.string().min(2, i18n.t("validation.companyNameRequired")),
  companyAddress: z
    .string()
    .min(10, i18n.t("validation.companyAddressRequired")),
  companyCnpj: z.string().regex(cnpjRegex, i18n.t("validation.invalidCnpj")),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const internshipGeneralSchema = z
  .object({
    startDate: z
      .string()
      .min(1, i18n.t("validation.startDateRequired"))
      .refine(
        (date) => {
          const validation = validateDate(date);
          return validation.valid;
        },
        {
          message: i18n.t("validation.startDateInvalid"),
        },
      ),
    endDate: z
      .string()
      .min(1, i18n.t("validation.endDateRequired"))
      .refine(
        (date) => {
          const validation = validateDate(date);
          return validation.valid;
        },
        {
          message: i18n.t("validation.endDateInvalid"),
        },
      ),
    hoursPerDay: z
      .number()
      .min(
        MIN_HOURS_PER_DAY,
        i18n.t("validation.hoursMin", { min: MIN_HOURS_PER_DAY }),
      )
      .max(
        MAX_HOURS_PER_DAY,
        i18n.t("validation.hoursMax", { max: MAX_HOURS_PER_DAY }),
      ),
    workDays: z
      .array(z.number().int().min(MIN_WEEKDAY).max(MAX_WEEKDAY))
      .min(1, i18n.t("validation.workDaysMin")),
    workSchedule: workScheduleSchema,
    modality: z.enum(["Remoto", "Presencial", "Híbrido"], {
      message: i18n.t("validation.modalityRequired"),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.hoursPerDay) return;

    if (!isValidWorkSchedule(data.workSchedule, data.hoursPerDay * 60)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("validation.scheduleTotalMismatch", {
          hours: data.hoursPerDay,
        }),
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
        message: i18n.t("validation.startDateNotWorkDay"),
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
        message: validation.error || i18n.t("validation.invalidPeriod"),
        path: ["endDate"],
      });
    }
  });

export type InternshipGeneralFormData = z.infer<
  typeof internshipGeneralSchema
>;

export const scheduleItemSchema = z
  .object({
    periodStart: z.string().min(1, i18n.t("validation.periodStartRequired")),
    periodEnd: z.string().min(1, i18n.t("validation.periodEndRequired")),
    description: z.string().min(10, i18n.t("validation.descriptionMin")),
  })
  .superRefine((item, ctx) => {
    if (!item.periodStart || !item.periodEnd) return;

    if (parseIsoDate(item.periodEnd) < parseIsoDate(item.periodStart)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("validation.periodEndAfterStart"),
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
    .array(z.string().min(5, i18n.t("validation.activitiesMin")))
    .min(1, i18n.t("validation.activitiesCount")),
  objectives: z
    .array(z.string().min(5, i18n.t("validation.objectivesMin")))
    .min(1, i18n.t("validation.objectivesCount")),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, i18n.t("validation.scheduleCount")),
  introduction: z.string().min(50, i18n.t("validation.introMin")),
  generalObjectives: z.string().min(30, i18n.t("validation.generalObjMin")),
  specificObjectives: z.string().min(30, i18n.t("validation.specificObjMin")),
  methodology: z.string().min(30, i18n.t("validation.methodologyMin")),
  development: z.string().min(50, i18n.t("validation.developmentMin")),
  conclusion: z.string().min(30, i18n.t("validation.conclusionMin")),
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
  if (holiday.isHoliday) {
    return i18n.t("validation.holidayInvalid", { name: holiday.name });
  }

  if (isWeekend(date)) {
    return i18n.t("validation.weekendInvalid", {
      day: getDayOfWeekPtBr(date),
    });
  }

  if (!workDays.includes(date.getDay())) {
    return i18n.t("validation.notWorkDay", { day: getDayOfWeekPtBr(date) });
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
          addIssue(i18n.t("validation.invalidDate"));
          return;
        }

        if (date < min || date > max) {
          addIssue(i18n.t("validation.dateMustBeBetween", { range }));
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

export type InternshipContentFormData = z.infer<
  typeof internshipContentSchema
>;
export type EvaluationFormData = z.infer<typeof evaluationSchema>;

export const supervisionSchema = z.object({
  supervisorName: z
    .string()
    .min(3, i18n.t("validation.supervisorNameRequired")),
  supervisorEmail: z.string().regex(emailRegex, i18n.t("validation.invalidEmail")),
  supervisorPhone: z.string().regex(phoneRegex, i18n.t("validation.invalidPhone")),
  supervisorPosition: z
    .string()
    .min(2, i18n.t("validation.supervisorPositionRequired")),
  supervisorCpf: z.string().regex(cpfRegex, i18n.t("validation.invalidCpf")),

  advisorName: z.string().min(3, i18n.t("validation.advisorNameRequired")),
  advisorEmail: z.string().regex(emailRegex, i18n.t("validation.invalidEmail")),
  advisorSiape: z.string().min(5, i18n.t("validation.advisorSiapeRequired")),
  advisorPosition: z
    .string()
    .min(2, i18n.t("validation.advisorPositionRequired")),

  evaluationDeadline: z
    .string()
    .min(1, i18n.t("validation.evaluationDeadlineRequired"))
    .refine(isValidIsoDate, i18n.t("validation.invalidDate")),
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
