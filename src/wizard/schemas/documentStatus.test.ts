import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mockInternshipData } from "../../mocks/mockInternshipData.ts";
import type { IInternshipData, IInternshipFraming } from "../../types/index.ts";
import { getDocumentStatus, isDocumentApplicable } from "./documentStatus.ts";
import {
  cnpjSchema,
  framingSchema,
  makeInternshipGeneralSchema,
  makeSupervisionSchema,
} from "./validationSchemas.ts";

const BEFORE_START = "2025-11-01";
const AFTER_END = "2026-02-01";

function withFraming(framing: Partial<IInternshipFraming>): IInternshipData {
  return {
    ...mockInternshipData,
    framing: { ...mockInternshipData.framing, ...framing },
  };
}

describe("framingSchema", () => {
  const valid = {
    course: "Engenharia da Computação",
    curriculumProfile: "novo",
    regime: "clt",
    declaredRequiredHours: null,
  };

  it("accepts a course with mandatory internship", () => {
    assert.equal(framingSchema.safeParse(valid).success, true);
  });

  it("refuses CC on the new profile and AI", () => {
    assert.equal(
      framingSchema.safeParse({
        ...valid,
        course: "Ciência da Computação",
      }).success,
      false,
    );
    assert.equal(
      framingSchema.safeParse({
        ...valid,
        course: "Inteligência Artificial",
      }).success,
      false,
    );
  });

  it("requires the declared hours for SI on the previous profile", () => {
    const declared = {
      ...valid,
      course: "Sistemas de Informação",
      curriculumProfile: "anterior",
    };

    assert.equal(framingSchema.safeParse(declared).success, false);
    assert.equal(
      framingSchema.safeParse({ ...declared, declaredRequiredHours: 200 })
        .success,
      true,
    );
  });

  it("requires a regime", () => {
    assert.equal(
      framingSchema.safeParse({ ...valid, regime: "" }).success,
      false,
    );
  });
});

describe("makeInternshipGeneralSchema", () => {
  const general = {
    ...mockInternshipData.general,
    hoursPerDay: 7,
    workSchedule: {
      morning: { start: 540, end: 750 },
      afternoon: { start: 810, end: 1020 },
    },
  };

  it("accepts 7h/day with a bond and refuses it with a TCE", () => {
    const withBond = makeInternshipGeneralSchema({
      requiredHours: 180,
      maxHoursPerDay: 8,
    });
    const withTce = makeInternshipGeneralSchema({
      requiredHours: 180,
      maxHoursPerDay: 6,
    });

    assert.equal(withBond.safeParse(general).success, true);
    assert.equal(withTce.safeParse(general).success, false);
  });

  it("refuses a period below the hours of the course", () => {
    const schema = makeInternshipGeneralSchema({
      requiredHours: 1000,
      maxHoursPerDay: 8,
    });

    assert.equal(schema.safeParse(general).success, false);
  });
});

describe("makeSupervisionSchema", () => {
  const { supervision } = mockInternshipData;
  const startDate = mockInternshipData.general.startDate;

  it("refuses the same person as supervisor and advisor", () => {
    const schema = makeSupervisionSchema({ hasSupervisor: true, startDate });

    assert.equal(schema.safeParse(supervision).success, true);
    assert.equal(
      schema.safeParse({
        ...supervision,
        advisorName: ` ${supervision.supervisorName.toUpperCase()} `,
      }).success,
      false,
    );
  });

  it("does not require a supervisor for a managing partner", () => {
    const schema = makeSupervisionSchema({ hasSupervisor: false, startDate });

    assert.equal(
      schema.safeParse({
        ...supervision,
        supervisorName: "",
        supervisorEmail: "",
        supervisorPhone: "",
        supervisorPosition: "",
        supervisorCpf: "",
      }).success,
      true,
    );
  });

  it("orders the evaluation dates", () => {
    const schema = makeSupervisionSchema({ hasSupervisor: true, startDate });

    assert.equal(
      schema.safeParse({
        ...supervision,
        evaluationDeadline: "2025-01-01",
      }).success,
      false,
    );
    assert.equal(
      schema.safeParse({
        ...supervision,
        goalsCompletionDate: "2025-12-01",
      }).success,
      false,
    );
  });
});

describe("cnpjSchema", () => {
  it("accepts numeric and alphanumeric CNPJ", () => {
    assert.equal(cnpjSchema.safeParse("11.222.333/0001-81").success, true);
    assert.equal(cnpjSchema.safeParse("12.ABC.345/01DE-35").success, true);
  });

  it("refuses letters in the check digits", () => {
    assert.equal(cnpjSchema.safeParse("12.ABC.345/01DE-3X").success, false);
  });
});

describe("getDocumentStatus", () => {
  it("accepts every document for complete data", () => {
    assert.deepEqual(
      getDocumentStatus("activity-plan", mockInternshipData, BEFORE_START)
        .blocking,
      [],
    );
    assert.deepEqual(
      getDocumentStatus("report", mockInternshipData, AFTER_END).blocking,
      [],
    );
  });

  it("blocks only the plan when the start date already passed", () => {
    const plan = getDocumentStatus(
      "activity-plan",
      mockInternshipData,
      AFTER_END,
    );

    assert.equal(plan.blocking.length, 1);
    assert.match(plan.blocking[0], /retroativa/);
    assert.deepEqual(
      getDocumentStatus("advisor-eval", mockInternshipData, AFTER_END).blocking,
      [],
    );
  });

  it("warns about final documents before the internship ends", () => {
    const { warnings } = getDocumentStatus(
      "report",
      mockInternshipData,
      BEFORE_START,
    );

    assert.equal(warnings.length, 1);
    assert.deepEqual(
      getDocumentStatus("report", mockInternshipData, AFTER_END).warnings,
      [],
    );
  });

  it("generates the plan before the report is written", () => {
    const data: IInternshipData = {
      ...mockInternshipData,
      content: { ...mockInternshipData.content, introduction: "" },
      evaluation: {
        ...mockInternshipData.evaluation,
        flexibleSchedule: { answer: null, comment: "" },
      },
    };

    assert.deepEqual(
      getDocumentStatus("activity-plan", data, BEFORE_START).blocking,
      [],
    );

    const report = getDocumentStatus("report", data, AFTER_END).blocking;
    assert.equal(report.length, 2);
    assert.match(report[0], /Introdução/);
    assert.match(report[1], /flexibilidade de horário/);
  });

  it("requires every grade unless it does not apply", () => {
    const data = withFraming({ regime: "socio" });
    const grades = mockInternshipData.evaluation.grades.map((grade) =>
      grade.item === "Acompanhamento do supervisor"
        ? { ...grade, grade: null }
        : grade,
    );
    const unanswered = {
      ...mockInternshipData,
      evaluation: { ...mockInternshipData.evaluation, grades },
    };

    assert.deepEqual(
      getDocumentStatus(
        "report",
        { ...data, evaluation: unanswered.evaluation },
        AFTER_END,
      ).blocking,
      [],
    );
    assert.equal(
      getDocumentStatus("report", unanswered, AFTER_END).blocking.length,
      1,
    );
  });

  it("applies the hours of the selected course", () => {
    const shortOnHours: IInternshipData = {
      ...mockInternshipData,
      general: {
        ...mockInternshipData.general,
        endDate: "2025-12-23",
      },
      content: {
        ...mockInternshipData.content,
        schedule: [
          {
            periodStart: "2025-11-19",
            periodEnd: "2025-12-23",
            description: "Período único de exemplo do cronograma.",
          },
        ],
      },
      supervision: {
        ...mockInternshipData.supervision,
        evaluationDeadline: "2025-12-23",
        goalsCompletionDate: "2025-12-23",
      },
    };

    assert.notDeepEqual(
      getDocumentStatus("activity-plan", shortOnHours, BEFORE_START).blocking,
      [],
    );
    assert.deepEqual(
      getDocumentStatus(
        "activity-plan",
        {
          ...shortOnHours,
          framing: {
            ...shortOnHours.framing,
            course: "Engenharia da Computação",
            curriculumProfile: "novo",
          },
        },
        BEFORE_START,
      ).blocking,
      [],
    );
  });

  it("revalidates the schedule when the dates change later", () => {
    const data: IInternshipData = {
      ...mockInternshipData,
      general: { ...mockInternshipData.general, endDate: "2026-02-13" },
      supervision: {
        ...mockInternshipData.supervision,
      },
      content: {
        ...mockInternshipData.content,
        schedule: [
          {
            periodStart: "2025-11-03",
            periodEnd: "2026-02-13",
            description: "Período que começa antes do novo início.",
          },
        ],
      },
    };

    assert.notDeepEqual(
      getDocumentStatus("activity-plan", data, BEFORE_START).blocking,
      [],
    );
  });

  it("does not reopen the calendar of a plan already accepted", () => {
    const acceptedBeforeNewHoliday: IInternshipData = {
      ...mockInternshipData,
      general: {
        ...mockInternshipData.general,
        startDate: "2025-12-08",
        endDate: "2026-01-14",
      },
      content: {
        ...mockInternshipData.content,
        schedule: [
          {
            periodStart: "2025-12-08",
            periodEnd: "2026-01-14",
            description: "Período único de exemplo do cronograma.",
          },
        ],
      },
      supervision: {
        ...mockInternshipData.supervision,
        evaluationDeadline: "2026-01-14",
        goalsCompletionDate: "2026-01-14",
      },
    };

    assert.deepEqual(
      getDocumentStatus("report", acceptedBeforeNewHoliday, AFTER_END).blocking,
      [],
    );
    assert.deepEqual(
      getDocumentStatus("advisor-eval", acceptedBeforeNewHoliday, AFTER_END)
        .blocking,
      [],
    );
    assert.notDeepEqual(
      getDocumentStatus("activity-plan", acceptedBeforeNewHoliday, BEFORE_START)
        .blocking,
      [],
    );
  });

  it("blocks everything while the framing is incomplete", () => {
    assert.equal(
      getDocumentStatus(
        "activity-plan",
        withFraming({ course: "Inteligência Artificial" }),
        BEFORE_START,
      ).blocking.length,
      1,
    );
  });
});

describe("isDocumentApplicable", () => {
  it("removes the supervisor evaluation for a managing partner", () => {
    assert.equal(isDocumentApplicable("supervisor-eval", "socio"), false);
    assert.equal(isDocumentApplicable("supervisor-eval", "tce"), true);
    assert.equal(isDocumentApplicable("advisor-eval", "socio"), true);
  });
});
