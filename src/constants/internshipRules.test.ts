import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MANDATORY_INTERNSHIP_RULES,
  REGIME_RULES,
  resolveInternshipRules,
} from "./internshipRules.ts";

describe("MANDATORY_INTERNSHIP_RULES", () => {
  it("pins the hours of each course regulation", () => {
    const hours = (rule: { kind: string; hours?: number }) =>
      rule.kind === "fixed" ? rule.hours : rule.kind;

    const table = Object.fromEntries(
      Object.entries(MANDATORY_INTERNSHIP_RULES).map(([course, profiles]) => [
        course,
        [hours(profiles.anterior), hours(profiles.novo)],
      ]),
    );

    assert.deepEqual(table, {
      "Ciência da Computação": [300, "none"],
      "Engenharia da Computação": [300, 180],
      "Sistemas de Informação": ["declared", 75],
      "Inteligência Artificial": ["none", "none"],
    });
  });
});

describe("REGIME_RULES", () => {
  it("allows 8h/day with a bond and 6h/day with a TCE", () => {
    assert.equal(REGIME_RULES.clt.maxHoursPerDay, 8);
    assert.equal(REGIME_RULES.servidor.maxHoursPerDay, 8);
    assert.equal(REGIME_RULES.socio.maxHoursPerDay, 8);
    assert.equal(REGIME_RULES.tce.maxHoursPerDay, 6);
  });

  it("drops the supervisor only for a managing partner", () => {
    assert.equal(REGIME_RULES.socio.hasSupervisor, false);
    assert.equal(REGIME_RULES.clt.hasSupervisor, true);
    assert.equal(REGIME_RULES.servidor.hasSupervisor, true);
    assert.equal(REGIME_RULES.tce.hasSupervisor, true);
  });
});

describe("resolveInternshipRules", () => {
  const framing = {
    course: "Engenharia da Computação",
    curriculumProfile: "novo",
    regime: "tce",
    declaredRequiredHours: null,
  } as const;

  it("combines the course hours with the regime limits", () => {
    const rules = resolveInternshipRules(framing);

    assert.ok(rules);
    assert.equal(rules.requiredHours, 180);
    assert.equal(rules.maxHoursPerDay, 6);
  });

  it("returns null for a course without mandatory internship", () => {
    assert.equal(
      resolveInternshipRules({
        ...framing,
        course: "Inteligência Artificial",
      }),
      null,
    );
    assert.equal(
      resolveInternshipRules({ ...framing, course: "Ciência da Computação" }),
      null,
    );
  });

  it("returns null while the framing is incomplete", () => {
    assert.equal(resolveInternshipRules({ ...framing, regime: "" }), null);
    assert.equal(
      resolveInternshipRules({ ...framing, curriculumProfile: "" }),
      null,
    );
  });

  it("uses the declared hours only for SI on the previous profile", () => {
    const declared = {
      ...framing,
      course: "Sistemas de Informação",
      curriculumProfile: "anterior",
    } as const;

    assert.equal(resolveInternshipRules(declared), null);
    assert.equal(
      resolveInternshipRules({ ...declared, declaredRequiredHours: 210 })
        ?.requiredHours,
      210,
    );
  });
});
