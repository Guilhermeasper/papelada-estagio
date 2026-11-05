import {
  DEFAULT_WORK_DAYS,
  MAX_HOURS_PER_DAY,
  MIN_HOURS_PER_DAY,
} from "@papelada-estagio/constants/business";
import { COURSES } from "@papelada-estagio/constants/internshipRules";
import {
  addDays,
  parseIsoDate,
  parseLegacyPeriod,
  toIsoString,
} from "./dateUtils";
import { parseLegacyWorkDays, toWeekdayRange } from "./workDays";
import { defaultWorkSchedule, parseLegacyWorkSchedule } from "./workSchedule";

// Define the shape of the persisted data for each version
// We use 'any' here because old versions might not match current types
export type MigrationFunction = (data: any) => any;

export const CURRENT_DATA_VERSION = 5;

const FIRST_NEW_CURRICULUM_ENROLLMENT = "2024.1";

function migrateAnswer(answer: unknown, isUntouchedDefault: boolean) {
  return {
    answer: !isUntouchedDefault && typeof answer === "boolean" ? answer : null,
    comment: "",
  };
}

function migrateEvaluation(evaluation: any) {
  const grades: any[] = Array.isArray(evaluation?.grades)
    ? evaluation.grades
    : [];

  // Antes da v5 o formulário não permitia editar a avaliação. Quando ela ainda é
  // igual aos valores fixos antigos, o aluno nunca respondeu.
  const isUntouchedDefault =
    grades.every((grade) => grade.grade === 10 && !grade.observation) &&
    evaluation?.flexibleSchedule === true &&
    evaluation?.reducedDuringExams === false &&
    evaluation?.requiresCompensation === false &&
    evaluation?.caresAboutAcademics === true &&
    evaluation?.recommendsPartnership === true;

  return {
    grades: grades.map((grade) => ({
      ...grade,
      grade: isUntouchedDefault ? null : grade.grade,
    })),
    flexibleSchedule: migrateAnswer(
      evaluation?.flexibleSchedule,
      isUntouchedDefault,
    ),
    reducedDuringExams: migrateAnswer(
      evaluation?.reducedDuringExams,
      isUntouchedDefault,
    ),
    requiresCompensation: migrateAnswer(
      evaluation?.requiresCompensation,
      isUntouchedDefault,
    ),
    caresAboutAcademics: migrateAnswer(
      evaluation?.caresAboutAcademics,
      isUntouchedDefault,
    ),
    recommendsPartnership: migrateAnswer(
      evaluation?.recommendsPartnership,
      isUntouchedDefault,
    ),
  };
}

function migrateEvaluationDeadline(
  deadline: unknown,
  endDate: unknown,
  schedule: any[],
): string {
  if (typeof deadline !== "string") return "";
  if (typeof endDate !== "string" || !endDate) return deadline;

  // O padrão antigo era o término + 12 dias, sem fonte. O modelo oficial põe o
  // parecer ao fim do segundo período.
  const oldDefault = toIsoString(addDays(parseIsoDate(endDate), 12));
  if (deadline !== oldDefault) return deadline;

  const secondPeriodEnd: unknown = schedule.at(1)?.periodEnd;
  return typeof secondPeriodEnd === "string" && secondPeriodEnd
    ? secondPeriodEnd
    : endDate;
}

export const MIGRATIONS: Partial<Record<number, MigrationFunction>> = {
  1: (data) => {
    const endDate = new Date(data.general.endDate);
    endDate.setDate(endDate.getDate() + 12);
    const evaluationDeadline = endDate.toISOString().split("T")[0];

    return {
      ...data,
      supervision: {
        ...data.supervision,
        evaluationDeadline,
      },
    };
  },
  2: (data) => {
    const general = data.general ?? {};

    const hoursPerDay = Math.min(
      Math.max(
        Number(general.hoursPerDay) || MIN_HOURS_PER_DAY,
        MIN_HOURS_PER_DAY,
      ),
      MAX_HOURS_PER_DAY,
    );

    const parsedDays = toWeekdayRange(
      parseLegacyWorkDays(String(general.workDays ?? "")) ?? [],
    );
    const workDays = parsedDays.length > 0 ? parsedDays : DEFAULT_WORK_DAYS;

    const totalMinutes = hoursPerDay * 60;
    const workSchedule =
      parseLegacyWorkSchedule(
        String(general.workSchedule ?? ""),
        totalMinutes,
      ) ?? defaultWorkSchedule(totalMinutes);

    return {
      ...data,
      general: {
        ...general,
        hoursPerDay,
        workDays,
        workSchedule,
      },
    };
  },
  3: (data) => {
    const content = data.content ?? {};
    const schedule: unknown[] = Array.isArray(content.schedule)
      ? content.schedule
      : [];

    return {
      ...data,
      content: {
        ...content,
        schedule: schedule.map((raw) => {
          const item = (raw ?? {}) as Record<string, unknown>;
          const description =
            typeof item.description === "string" ? item.description : "";

          if (
            typeof item.periodStart === "string" &&
            typeof item.periodEnd === "string"
          ) {
            return {
              periodStart: item.periodStart,
              periodEnd: item.periodEnd,
              description,
            };
          }

          return { ...parseLegacyPeriod(item.period), description };
        }),
      },
    };
  },
  4: (data) => {
    const { course, ...student } = data.student ?? {};
    const general = data.general ?? {};
    const content = data.content ?? {};
    const supervision = data.supervision ?? {};
    const schedule: any[] = Array.isArray(content.schedule)
      ? content.schedule
      : [];
    const enrollmentYear: unknown = student.enrollmentYear;

    const evaluationDeadline = migrateEvaluationDeadline(
      supervision.evaluationDeadline,
      general.endDate,
      schedule,
    );
    const endDate = typeof general.endDate === "string" ? general.endDate : "";

    return {
      ...data,
      framing: {
        course: COURSES.find((known) => known === course) ?? "",
        curriculumProfile:
          typeof enrollmentYear === "string" && enrollmentYear
            ? enrollmentYear >= FIRST_NEW_CURRICULUM_ENROLLMENT
              ? "novo"
              : "anterior"
            : "",
        // Até a v4 o app só atendia alunos com vínculo CLT.
        regime: "clt",
        declaredRequiredHours: null,
      },
      student,
      content: {
        ...content,
        scheduleDiscussion: "",
        references: "",
      },
      evaluation: migrateEvaluation(data.evaluation),
      supervision: {
        ...supervision,
        evaluationDeadline,
        goalsCompletionDate:
          evaluationDeadline > endDate ? evaluationDeadline : endDate,
      },
    };
  },
};

export function migrateData(data: unknown, fromVersion: number): unknown {
  let currentData = data;
  let currentVersion = fromVersion;

  while (currentVersion < CURRENT_DATA_VERSION) {
    const migration = MIGRATIONS[currentVersion];
    if (migration) {
      console.log(
        `Migrating data from version ${currentVersion} to ${currentVersion + 1}`,
      );
      try {
        currentData = migration(currentData);
      } catch (error) {
        console.error(`Migration failed at version ${currentVersion}`, error);
        throw new Error(
          `Falha na migração dos dados da versão ${currentVersion}`,
        );
      }
    } else {
      console.warn(`No migration found for version ${currentVersion}`);
    }
    currentVersion++;
  }

  return currentData;
}
