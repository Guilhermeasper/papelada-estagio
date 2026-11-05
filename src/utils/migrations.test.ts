import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CURRENT_DATA_VERSION, migrateData } from "./migrations.ts";

interface ExampleFile {
  version: number;
  data: unknown;
}

interface MigratedData {
  framing: {
    course: string;
    curriculumProfile: string;
    regime: string;
    declaredRequiredHours: number | null;
  };
  student: Record<string, unknown>;
  supervision: { evaluationDeadline: string; goalsCompletionDate: string };
  general: { workDays: number[]; workSchedule: unknown };
  content: {
    schedule: { periodStart: string; periodEnd: string }[];
    scheduleDiscussion: string;
    references: string;
  };
  evaluation: {
    grades: { grade: number | null }[];
    flexibleSchedule: { answer: boolean | null; comment: string };
  };
}

function readExample(name: string): ExampleFile {
  const url = new URL(`../../examples/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as ExampleFile;
}

describe("migrateData", () => {
  it("upgrades the v1 example to the current field shapes", () => {
    const legacy = readExample("import-example-v1-legacy.json");

    const migrated = migrateData(legacy.data, legacy.version) as MigratedData;

    assert.equal(migrated.supervision.evaluationDeadline, "2026-01-14");
    assert.equal(migrated.supervision.goalsCompletionDate, "2026-01-14");
    assert.deepEqual(migrated.general.workDays, [1, 2, 3, 4, 5]);
    assert.deepEqual(migrated.general.workSchedule, {
      morning: { start: 540, end: 720 },
      afternoon: { start: 780, end: 1080 },
    });
    assert.deepEqual(
      migrated.content.schedule.map(({ periodStart, periodEnd }) => [
        periodStart,
        periodEnd,
      ]),
      [
        ["2025-11-19", "2025-11-30"],
        ["2025-12-01", "2026-01-14"],
      ],
    );
  });

  it("returns data unchanged when already at the current version", () => {
    const current = readExample("import-example.json");

    assert.deepEqual(
      migrateData(current.data, CURRENT_DATA_VERSION),
      current.data,
    );
  });

  it("skips versions without a migration", () => {
    const migrated = migrateData(
      { general: { endDate: "2026-01-14" }, content: {} },
      0,
    ) as MigratedData;

    assert.deepEqual(migrated.content.schedule, []);
  });

  it("reports the version that failed", () => {
    assert.throws(
      () => migrateData({}, 1),
      /Falha na migração dos dados da versão 1/,
    );
  });
});

describe("migration to v5", () => {
  const v4 = {
    student: {
      fullName: "Aluno",
      course: "Engenharia da Computação",
      enrollmentYear: "2020.1",
    },
    general: { endDate: "2026-01-15" },
    content: {
      schedule: [
        { periodStart: "2025-11-19", periodEnd: "2025-12-05" },
        { periodStart: "2025-12-09", periodEnd: "2025-12-24" },
      ],
    },
    evaluation: {
      grades: [{ item: "Ambiente", grade: 10, observation: "" }],
      flexibleSchedule: true,
      reducedDuringExams: false,
      requiresCompensation: false,
      caresAboutAcademics: true,
      recommendsPartnership: true,
    },
    supervision: { evaluationDeadline: "2026-01-27" },
  };

  const migrate = (data: unknown) => migrateData(data, 4) as MigratedData;

  it("moves the course to the framing as a CLT student", () => {
    const { framing, student } = migrate(v4);

    assert.deepEqual(framing, {
      course: "Engenharia da Computação",
      curriculumProfile: "anterior",
      regime: "clt",
      declaredRequiredHours: null,
    });
    assert.equal("course" in student, false);
  });

  it("infers the new profile from the enrollment", () => {
    const { framing } = migrate({
      ...v4,
      student: { ...v4.student, enrollmentYear: "2024.1" },
    });

    assert.equal(framing.curriculumProfile, "novo");
  });

  it("clears a free-text course it does not recognize", () => {
    const { framing } = migrate({
      ...v4,
      student: { ...v4.student, course: "Computação" },
    });

    assert.equal(framing.course, "");
  });

  it("clears evaluation answers the student never gave", () => {
    const { evaluation } = migrate(v4);

    assert.equal(evaluation.grades[0].grade, null);
    assert.deepEqual(evaluation.flexibleSchedule, {
      answer: null,
      comment: "",
    });
  });

  it("keeps an evaluation the student edited", () => {
    const { evaluation } = migrate({
      ...v4,
      evaluation: {
        ...v4.evaluation,
        grades: [{ item: "Ambiente", grade: 7, observation: "" }],
      },
    });

    assert.equal(evaluation.grades[0].grade, 7);
    assert.equal(evaluation.flexibleSchedule.answer, true);
  });

  it("replaces the old default deadline with the end of the second period", () => {
    const { supervision } = migrate(v4);

    assert.equal(supervision.evaluationDeadline, "2025-12-24");
    assert.equal(supervision.goalsCompletionDate, "2026-01-15");
  });

  it("keeps a deadline chosen by the student", () => {
    const { supervision } = migrate({
      ...v4,
      supervision: { evaluationDeadline: "2026-02-10" },
    });

    assert.equal(supervision.evaluationDeadline, "2026-02-10");
    assert.equal(supervision.goalsCompletionDate, "2026-02-10");
  });

  it("adds the new report fields", () => {
    const { content } = migrate(v4);

    assert.equal(content.scheduleDiscussion, "");
    assert.equal(content.references, "");
  });
});
