import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CURRENT_DATA_VERSION, migrateData } from "./migrations.ts";

interface ExampleFile {
  version: number;
  data: unknown;
}

interface MigratedData {
  supervision: { evaluationDeadline: string };
  general: { workDays: number[]; workSchedule: unknown };
  content: { schedule: { periodStart: string; periodEnd: string }[] };
}

function readExample(name: string): ExampleFile {
  const url = new URL(`../../examples/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as ExampleFile;
}

describe("migrateData", () => {
  it("upgrades the v1 example to the current field shapes", () => {
    const legacy = readExample("import-example-v1-legacy.json");

    const migrated = migrateData(legacy.data, legacy.version) as MigratedData;

    assert.equal(migrated.supervision.evaluationDeadline, "2026-01-26");
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
    const data = { general: {}, content: {} };

    assert.deepEqual(migrateData(data, 3), {
      general: {},
      content: { schedule: [] },
    });
  });

  it("reports the version that failed", () => {
    assert.throws(
      () => migrateData({}, 1),
      /Falha na migração dos dados da versão 1/,
    );
  });
});
