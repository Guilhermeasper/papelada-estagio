import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatDateIso,
  formatDatePtBr,
  parseLegacyPeriod,
} from "./dateUtils.ts";
import { getBackspacedMaskValue, maskDate } from "./masks.ts";

describe("maskDate", () => {
  it("returns empty for empty input", () => {
    assert.equal(maskDate(""), "");
  });

  it("keeps a single digit unformatted", () => {
    assert.equal(maskDate("0"), "0");
  });

  it("emits the separator after the day", () => {
    assert.equal(maskDate("06"), "06/");
  });

  it("emits the separator after the month", () => {
    assert.equal(maskDate("0601"), "06/01/");
  });

  it("formats a full date", () => {
    assert.equal(maskDate("06012025"), "06/01/2025");
  });

  it("discards digits past the year", () => {
    assert.equal(maskDate("060120259"), "06/01/2025");
  });

  it("strips non-digits", () => {
    assert.equal(maskDate("06/01/2025"), "06/01/2025");
    assert.equal(maskDate("ab06cd01ef2025"), "06/01/2025");
  });
});

describe("getBackspacedMaskValue", () => {
  it("passes typed input through untouched", () => {
    assert.equal(getBackspacedMaskValue("060", "06/"), "060");
    assert.equal(getBackspacedMaskValue("06", ""), "06");
  });

  it("drops the preceding digit when a separator is backspaced", () => {
    assert.equal(getBackspacedMaskValue("06", "06/"), "0");
    assert.equal(getBackspacedMaskValue("06/01", "06/01/"), "060");
  });

  it("passes through when a digit itself is backspaced", () => {
    assert.equal(getBackspacedMaskValue("06/", "06/1"), "06/");
  });

  it("passes through when the value grows", () => {
    assert.equal(getBackspacedMaskValue("06/012", "06/01/"), "06/012");
  });
});

describe("formatDateIso", () => {
  it("converts a full pt-BR date", () => {
    assert.equal(formatDateIso("06/01/2025"), "2025-01-06");
  });

  it("returns empty for an incomplete date", () => {
    assert.equal(formatDateIso("06/01/"), "");
    assert.equal(formatDateIso("06/01/202"), "");
    assert.equal(formatDateIso(""), "");
  });

  it("rejects dates that roll over to the next month", () => {
    assert.equal(formatDateIso("31/02/2025"), "");
    assert.equal(formatDateIso("31/04/2025"), "");
  });

  it("accepts a valid leap day and rejects an invalid one", () => {
    assert.equal(formatDateIso("29/02/2024"), "2024-02-29");
    assert.equal(formatDateIso("29/02/2025"), "");
  });

  it("rejects out-of-range day and month", () => {
    assert.equal(formatDateIso("00/01/2025"), "");
    assert.equal(formatDateIso("32/01/2025"), "");
    assert.equal(formatDateIso("06/00/2025"), "");
    assert.equal(formatDateIso("06/13/2025"), "");
  });

  it("round-trips with formatDatePtBr", () => {
    for (const iso of [
      "2025-01-06",
      "2024-02-29",
      "2025-12-31",
      "2026-07-28",
    ]) {
      assert.equal(formatDateIso(formatDatePtBr(iso)), iso);
    }
  });
});

describe("parseLegacyPeriod", () => {
  it("converts the periods shipped in import-example-v1-legacy.json", () => {
    assert.deepEqual(parseLegacyPeriod("19/11/2025 a 30/11/2025"), {
      periodStart: "2025-11-19",
      periodEnd: "2025-11-30",
    });
    assert.deepEqual(parseLegacyPeriod("01/12/2025 a 14/01/2026"), {
      periodStart: "2025-12-01",
      periodEnd: "2026-01-14",
    });
  });

  it("returns empty parts for unparseable periods", () => {
    const empty = { periodStart: "", periodEnd: "" };
    assert.deepEqual(parseLegacyPeriod("19/11/2025"), empty);
    assert.deepEqual(parseLegacyPeriod("31/02/2025 a 30/11/2025"), empty);
    assert.deepEqual(parseLegacyPeriod(undefined), empty);
  });
});
