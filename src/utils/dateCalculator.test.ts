import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateEndDate,
  validateInternshipPeriod,
} from "./dateCalculator.ts";
import { isHoliday } from "./holidays.ts";
import { parseIsoDate } from "./dateUtils.ts";

const WEEKDAYS = [1, 2, 3, 4, 5];

describe("holidays", () => {
  it("includes the holidays that were missing", () => {
    for (const date of ["2026-11-20", "2026-07-16", "2026-12-08"]) {
      assert.equal(isHoliday(parseIsoDate(date)).isHoliday, true, date);
    }
  });
});

describe("calculateEndDate", () => {
  it("reaches the hours required by the course", () => {
    const result = calculateEndDate("2027-03-01", 6, WEEKDAYS, 180);

    assert.equal(result.isValid, true);
    assert.equal(result.totalWorkdays, 30);
    assert.equal(result.totalHours, 180);
  });

  it("counts 20/11 as a day off", () => {
    const result = calculateEndDate("2026-11-16", 8, WEEKDAYS, 40);

    assert.equal(result.endDate, "2026-11-23");
  });
});

describe("validateInternshipPeriod", () => {
  it("accepts a period that meets the required hours", () => {
    const { endDate } = calculateEndDate("2027-03-01", 6, WEEKDAYS, 75);

    assert.deepEqual(
      validateInternshipPeriod("2027-03-01", endDate, 6, WEEKDAYS, 75),
      { valid: true },
    );
  });

  it("refuses a period below the required hours", () => {
    const { endDate } = calculateEndDate("2027-03-01", 6, WEEKDAYS, 75);
    const result = validateInternshipPeriod(
      "2027-03-01",
      endDate,
      6,
      WEEKDAYS,
      300,
    );

    assert.equal(result.valid, false);
  });
});
