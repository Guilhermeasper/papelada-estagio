import {
  MAX_WEEKDAY,
  MIN_HOURS_PER_DAY,
  MIN_WEEKDAY,
} from "@papelada-estagio/constants/business";
import {
  COURSES,
  CURRICULUM_PROFILES,
  INTERNSHIP_REGIMES,
  MANDATORY_INTERNSHIP_RULES,
} from "@papelada-estagio/constants/internshipRules";
import type {
  IInternshipGeneral,
  IScheduleItem,
} from "@papelada-estagio/types";
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
  afternoon: workPeriodSchema.nullable(),
});

const phoneRegex = /^\(?[0-9]{2}\)?[\s]?[0-9]{4,5}[-\s]?[0-9]{4}$/;
const cnpjRegex =
  /^[A-Z0-9]{2}\.?[A-Z0-9]{3}\.?[A-Z0-9]{3}\/?[A-Z0-9]{4}-?[0-9]{2}$/;
const cpfRegex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .regex(emailRegex, i18n.t("validation.invalidEmail"));
export const phoneSchema = z
  .string()
  .regex(phoneRegex, i18n.t("validation.invalidPhone"));
export const cnpjSchema = z
  .string()
  .regex(cnpjRegex, i18n.t("validation.invalidCnpj"));
export const cpfSchema = z
  .string()
  .regex(cpfRegex, i18n.t("validation.invalidCpf"));

export const framingSchema = z
  .object({
    course: z
      .enum([...COURSES, ""])
      .refine(Boolean, i18n.t("validation.courseRequired")),
    curriculumProfile: z.enum([...CURRICULUM_PROFILES, ""]),
    regime: z
      .enum([...INTERNSHIP_REGIMES, ""])
      .refine(Boolean, i18n.t("validation.regimeRequired")),
    declaredRequiredHours: z.number().int().positive().nullable(),
  })
  .superRefine(({ course, curriculumProfile, declaredRequiredHours }, ctx) => {
    if (!course) return;

    if (!curriculumProfile) {
      ctx.addIssue({
        code: "custom",
        message: i18n.t("validation.curriculumProfileRequired"),
        path: ["curriculumProfile"],
      });
      return;
    }

    const rule = MANDATORY_INTERNSHIP_RULES[course][curriculumProfile];

    if (rule.kind === "none") {
      ctx.addIssue({
        code: "custom",
        message: i18n.t("validation.noMandatoryInternship"),
        path: ["course"],
      });
    }

    if (rule.kind === "declared" && !declaredRequiredHours) {
      ctx.addIssue({
        code: "custom",
        message: i18n.t("validation.declaredHoursRequired"),
        path: ["declaredRequiredHours"],
      });
    }
  });

export type FramingFormData = z.infer<typeof framingSchema>;

export const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, i18n.t("validation.nameMin"))
    .max(100, i18n.t("validation.nameMax")),
  email: emailSchema,
  address: z.string().min(10, i18n.t("validation.addressMin")),
  phone: phoneSchema,
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
  companyCnpj: cnpjSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;

export interface GeneralRules {
  requiredHours: number;
  maxHoursPerDay: number;
}

export function makeInternshipGeneralSchema({
  requiredHours,
  maxHoursPerDay,
}: GeneralRules) {
  return z
    .object({
      startDate: z
        .string()
        .min(1, i18n.t("validation.startDateRequired"))
        .refine((date) => validateDate(date).valid, {
          message: i18n.t("validation.startDateInvalid"),
        }),
      endDate: z
        .string()
        .min(1, i18n.t("validation.endDateRequired"))
        .refine((date) => validateDate(date).valid, {
          message: i18n.t("validation.endDateInvalid"),
        }),
      hoursPerDay: z
        .number()
        .min(
          MIN_HOURS_PER_DAY,
          i18n.t("validation.hoursMin", { min: MIN_HOURS_PER_DAY }),
        )
        .max(
          maxHoursPerDay,
          i18n.t("validation.hoursMax", { max: maxHoursPerDay }),
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
          code: "custom",
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
          code: "custom",
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
        requiredHours,
      );

      if (!validation.valid) {
        ctx.addIssue({
          code: "custom",
          message: validation.error || i18n.t("validation.invalidPeriod"),
          path: ["endDate"],
        });
      }
    });
}

// Os documentos finais repetem o período já aceito pela SecGrad. O calendário do
// app é uma estimativa e não pode invalidar depois uma vigência já formalizada.
export const acceptedPeriodSchema = z.object({
  startDate: z.string().min(1, i18n.t("validation.startDateRequired")),
  endDate: z.string().min(1, i18n.t("validation.endDateRequired")),
});

export type InternshipGeneralFormData = z.infer<
  ReturnType<typeof makeInternshipGeneralSchema>
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
        code: "custom",
        message: i18n.t("validation.periodEndAfterStart"),
        path: ["periodEnd"],
      });
    }
  });

const planContentShape = {
  activities: z
    .array(z.string().min(5, i18n.t("validation.activitiesMin")))
    .min(1, i18n.t("validation.activitiesCount")),
  objectives: z
    .array(z.string().min(5, i18n.t("validation.objectivesMin")))
    .min(1, i18n.t("validation.objectivesCount")),
  schedule: z
    .array(scheduleItemSchema)
    .min(1, i18n.t("validation.scheduleCount")),
};

export const reportContentSchema = z.object({
  introduction: z.string().min(50, i18n.t("validation.introMin")),
  generalObjectives: z.string().min(30, i18n.t("validation.generalObjMin")),
  specificObjectives: z.string().min(30, i18n.t("validation.specificObjMin")),
  scheduleDiscussion: z
    .string()
    .min(30, i18n.t("validation.scheduleDiscussionMin")),
  methodology: z.string().min(30, i18n.t("validation.methodologyMin")),
  development: z.string().min(50, i18n.t("validation.developmentMin")),
  conclusion: z.string().min(30, i18n.t("validation.conclusionMin")),
});

const evaluationAnswerSchema = z.object({
  answer: z.boolean().nullable(),
  comment: z.string(),
});

const gradeOutOfRange = i18n.t("validation.gradeRange");

export const evaluationGradeSchema = z.object({
  item: z.string(),
  grade: z
    .number(gradeOutOfRange)
    .min(0, gradeOutOfRange)
    .max(10, gradeOutOfRange)
    .nullable(),
  observation: z.string(),
});

export const evaluationSchema = z.object({
  grades: z.array(evaluationGradeSchema),
  flexibleSchedule: evaluationAnswerSchema,
  reducedDuringExams: evaluationAnswerSchema,
  requiresCompensation: evaluationAnswerSchema,
  caresAboutAcademics: evaluationAnswerSchema,
  recommendsPartnership: evaluationAnswerSchema,
});

export type EvaluationFormData = z.infer<typeof evaluationSchema>;

export type ScheduleBounds = Pick<
  IInternshipGeneral,
  "startDate" | "endDate" | "workDays"
>;

function getScheduleDateIssue(date: Date, workDays: number[]): string | null {
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

function addScheduleBoundIssues(
  schedule: IScheduleItem[],
  { startDate, endDate, workDays }: ScheduleBounds,
  ctx: z.RefinementCtx,
) {
  if (!startDate || !endDate || workDays.length === 0) return;

  const min = parseIsoDate(startDate);
  const max = parseIsoDate(endDate);
  const range = `${formatDatePtBr(startDate)} e ${formatDatePtBr(endDate)}`;

  schedule.forEach((item, index) => {
    (["periodStart", "periodEnd"] as const).forEach((key) => {
      const value = item[key];
      if (!value) return;

      const addIssue = (message: string) =>
        ctx.addIssue({
          code: "custom",
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
}

export const reportScheduleSchema = z.object(planContentShape);

export function makePlanContentSchema(bounds: ScheduleBounds) {
  return z
    .object(planContentShape)
    .superRefine(({ schedule }, ctx) =>
      addScheduleBoundIssues(schedule, bounds, ctx),
    );
}

// O passo 5 exige só o que o Plano usa. O conteúdo do relatório é escrito no fim
// do estágio e é cobrado ao gerar o Relatório: ver getDocumentStatus.
export function makeInternshipContentSchema(bounds: ScheduleBounds) {
  return z
    .object({
      ...planContentShape,
      introduction: z.string(),
      generalObjectives: z.string(),
      specificObjectives: z.string(),
      scheduleDiscussion: z.string(),
      methodology: z.string(),
      development: z.string(),
      conclusion: z.string(),
      references: z.string(),
      evaluation: evaluationSchema,
    })
    .superRefine(({ schedule }, ctx) =>
      addScheduleBoundIssues(schedule, bounds, ctx),
    );
}

export type InternshipContentFormData = z.infer<
  ReturnType<typeof makeInternshipContentSchema>
>;

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export interface SupervisionRules {
  hasSupervisor: boolean;
  startDate: string;
}

function makeSupervisionFields(hasSupervisor: boolean) {
  return {
    supervisorName: hasSupervisor
      ? z.string().min(3, i18n.t("validation.supervisorNameRequired"))
      : z.string(),
    supervisorEmail: hasSupervisor ? emailSchema : z.string(),
    supervisorPhone: hasSupervisor ? phoneSchema : z.string(),
    supervisorPosition: hasSupervisor
      ? z.string().min(2, i18n.t("validation.supervisorPositionRequired"))
      : z.string(),
    supervisorCpf: hasSupervisor ? cpfSchema : z.string(),

    advisorName: z.string().min(3, i18n.t("validation.advisorNameRequired")),
    advisorEmail: emailSchema,
    advisorSiape: z.string().min(5, i18n.t("validation.advisorSiapeRequired")),
    advisorPosition: z
      .string()
      .min(2, i18n.t("validation.advisorPositionRequired")),

    evaluationDeadline: z
      .string()
      .min(1, i18n.t("validation.evaluationDeadlineRequired"))
      .refine(isValidIsoDate, i18n.t("validation.invalidDate")),
    goalsCompletionDate: z
      .string()
      .min(1, i18n.t("validation.goalsCompletionDateRequired"))
      .refine(isValidIsoDate, i18n.t("validation.invalidDate")),
  };
}

export function makeSupervisionSchema({
  hasSupervisor,
  startDate,
}: SupervisionRules) {
  return z
    .object(makeSupervisionFields(hasSupervisor))
    .superRefine((data, ctx) => {
      if (
        hasSupervisor &&
        normalizeName(data.supervisorName) === normalizeName(data.advisorName)
      ) {
        ctx.addIssue({
          code: "custom",
          message: i18n.t("validation.supervisorMustDifferFromAdvisor"),
          path: ["advisorName"],
        });
      }

      if (startDate && data.evaluationDeadline < startDate) {
        ctx.addIssue({
          code: "custom",
          message: i18n.t("validation.evaluationBeforeStart"),
          path: ["evaluationDeadline"],
        });
      }

      if (data.goalsCompletionDate < data.evaluationDeadline) {
        ctx.addIssue({
          code: "custom",
          message: i18n.t("validation.goalsBeforeEvaluation"),
          path: ["goalsCompletionDate"],
        });
      }
    });
}

export type SupervisionFormData = z.infer<
  ReturnType<typeof makeSupervisionSchema>
>;

function stringShape<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  const shape = {} as { [K in keyof T]: z.ZodString };
  for (const key of Object.keys(schema.shape) as (keyof T)[]) {
    shape[key] = z.string();
  }
  return z.object(shape);
}

const framingImportSchema = z.object({
  course: z.enum([...COURSES, ""]).catch(""),
  curriculumProfile: z.enum([...CURRICULUM_PROFILES, ""]).catch(""),
  regime: z.enum([...INTERNSHIP_REGIMES, ""]).catch(""),
  declaredRequiredHours: z.number().nullable().catch(null),
});

const studentImportSchema = stringShape(studentSchema);
const companyImportSchema = stringShape(companySchema);
const supervisionImportSchema = stringShape(
  z.object(makeSupervisionFields(true)),
);

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
  scheduleDiscussion: z.string(),
  methodology: z.string(),
  development: z.string(),
  conclusion: z.string(),
  references: z.string(),
});

const importDataSchema = z.object({
  framing: framingImportSchema,
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
