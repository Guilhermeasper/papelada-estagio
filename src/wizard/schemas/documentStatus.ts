import {
  EVALUATION_ANSWER_KEYS,
  getApplicableGrades,
  regimeHasSupervisor,
  resolveInternshipRules,
} from "@papelada-estagio/constants/internshipRules";
import type {
  DocumentType,
  IEvaluationData,
  IInternshipData,
  InternshipRegime,
} from "@papelada-estagio/types";
import type { z } from "zod";
import i18n from "../../i18n";
import {
  acceptedPeriodSchema,
  companySchema,
  makeInternshipGeneralSchema,
  makePlanContentSchema,
  makeSupervisionSchema,
  reportContentSchema,
  reportScheduleSchema,
  studentSchema,
} from "./validationSchemas";

export type DocumentPhase = "initial" | "final";

export const DOCUMENT_PHASES: Record<DocumentType, DocumentPhase> = {
  "activity-plan": "initial",
  report: "final",
  "advisor-eval": "final",
  "supervisor-eval": "final",
};

export interface DocumentStatus {
  blocking: string[];
  warnings: string[];
}

export function isDocumentApplicable(
  type: DocumentType,
  regime: InternshipRegime | "",
): boolean {
  return type !== "supervisor-eval" || regimeHasSupervisor(regime);
}

function issuesOf(schema: z.ZodType, value: unknown): string[] {
  const result = schema.safeParse(value);
  return result.success
    ? []
    : result.error.issues.map(({ message }) => message);
}

function getEvaluationIssues(
  evaluation: IEvaluationData,
  regime: InternshipRegime | "",
): string[] {
  const questions = i18n.t("pdf.report.evaluationQuestions", {
    returnObjects: true,
  });

  return [
    ...getApplicableGrades(evaluation.grades, regime)
      .filter(({ grade }) => grade === null)
      .map(({ item }) => i18n.t("validation.gradeRequired", { item })),
    ...EVALUATION_ANSWER_KEYS.flatMap((key, index) =>
      evaluation[key].answer === null
        ? [i18n.t("validation.answerRequired", { question: questions[index] })]
        : [],
    ),
  ];
}

function getContentIssues(type: DocumentType, data: IInternshipData): string[] {
  const { content, evaluation, framing, general } = data;

  if (type === "activity-plan") {
    return issuesOf(makePlanContentSchema(general), content);
  }

  if (type === "report") {
    return [
      ...issuesOf(reportScheduleSchema, content),
      ...issuesOf(reportContentSchema, content),
      ...getEvaluationIssues(evaluation, framing.regime),
    ];
  }

  return [];
}

function getPhaseStatus(
  type: DocumentType,
  { startDate, endDate }: IInternshipData["general"],
  today: string,
): DocumentStatus {
  if (DOCUMENT_PHASES[type] === "initial") {
    return {
      blocking:
        startDate && startDate < today
          ? [i18n.t("download.status.retroactive")]
          : [],
      warnings: [],
    };
  }

  return {
    blocking: [],
    warnings:
      endDate && today <= endDate ? [i18n.t("download.status.beforeEnd")] : [],
  };
}

export function getDocumentStatus(
  type: DocumentType,
  data: IInternshipData,
  today: string,
): DocumentStatus {
  const rules = resolveInternshipRules(data.framing);

  if (!rules) {
    return {
      blocking: [i18n.t("download.status.framingIncomplete")],
      warnings: [],
    };
  }

  const phase = getPhaseStatus(type, data.general, today);
  const issues = [
    ...issuesOf(studentSchema, data.student),
    ...issuesOf(companySchema, data.company),
    ...issuesOf(
      DOCUMENT_PHASES[type] === "initial"
        ? makeInternshipGeneralSchema(rules)
        : acceptedPeriodSchema,
      data.general,
    ),
    ...issuesOf(
      makeSupervisionSchema({
        hasSupervisor: rules.hasSupervisor,
        startDate: data.general.startDate,
      }),
      data.supervision,
    ),
    ...getContentIssues(type, data),
  ];

  return {
    blocking: [...new Set([...phase.blocking, ...issues])],
    warnings: phase.warnings,
  };
}
