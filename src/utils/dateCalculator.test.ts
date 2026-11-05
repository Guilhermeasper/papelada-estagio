import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateEndDate,
  exceedsMaxDuration,
  getSubmissionTimeline,
  subtractWorkdays,
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

describe("subtractWorkdays", () => {
  it("skips weekends", () => {
    assert.equal(subtractWorkdays("2027-05-17", 8), "2027-05-05");
  });

  it("skips holidays", () => {
    // Sexta 20/11/2026 é feriado: 8 dias úteis antes de 25/11 chega a 12/11.
    assert.equal(subtractWorkdays("2026-11-25", 8), "2026-11-12");
  });
});

describe("getSubmissionTimeline", () => {
  const start = "2027-05-17";

  it("computes the three deadlines", () => {
    const timeline = getSubmissionTimeline(start, "2027-01-04");

    assert.equal(timeline.recommendedStartBy, "2027-04-26");
    assert.equal(timeline.submissionDeadline, "2027-05-05");
    assert.equal(timeline.insuranceDeadline, "2027-04-15");
    assert.equal(timeline.status, "onTrack");
  });

  it("classifies how late the student is", () => {
    const status = (today: string) =>
      getSubmissionTimeline(start, today).status;

    assert.equal(status("2027-04-26"), "onTrack");
    assert.equal(status("2027-04-27"), "tight");
    assert.equal(status("2027-05-05"), "tight");
    assert.equal(status("2027-05-06"), "late");
    assert.equal(status("2027-05-17"), "late");
    assert.equal(status("2027-05-18"), "retroactive");
  });

  it("wraps the insurance deadline across the year", () => {
    assert.equal(
      getSubmissionTimeline("2027-01-11", "2026-11-01").insuranceDeadline,
      "2026-12-15",
    );
  });
});

describe("exceedsMaxDuration", () => {
  it("allows exactly 2 years and refuses more", () => {
    assert.equal(exceedsMaxDuration("2027-03-01", "2029-03-01"), false);
    assert.equal(exceedsMaxDuration("2027-03-01", "2029-03-02"), true);
  });
});
