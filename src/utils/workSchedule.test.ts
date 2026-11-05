import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  defaultWorkSchedule,
  formatWorkSchedule,
  isValidWorkSchedule,
  rebalanceForTotal,
  resolveContinuousSchedule,
  setContinuous,
} from "./workSchedule.ts";

const continuous = (start: number, end: number) => ({
  morning: { start, end },
  afternoon: null,
});

describe("continuous work schedule", () => {
  it("accepts a continuous shift of up to 6h", () => {
    assert.equal(isValidWorkSchedule(continuous(480, 720), 240), true);
    assert.equal(isValidWorkSchedule(continuous(480, 840), 360), true);
  });

  it("requires a break above 6h", () => {
    assert.equal(isValidWorkSchedule(continuous(480, 900), 420), false);
  });

  it("requires the shift to match the daily hours", () => {
    assert.equal(isValidWorkSchedule(continuous(480, 720), 360), false);
  });

  it("formats like the official form", () => {
    assert.equal(
      formatWorkSchedule(continuous(480, 720)),
      "Das 8:00h às 12:00h",
    );
  });

  it("switches between one and two shifts keeping the start", () => {
    const split = defaultWorkSchedule(360);
    const single = setContinuous(split, true, 360);

    assert.deepEqual(
      single,
      continuous(split.morning.start, split.morning.start + 360),
    );

    const back = setContinuous(single, false, 360);
    assert.equal(isValidWorkSchedule(back, 360), true);
    assert.notEqual(back.afternoon, null);
  });

  it("falls back to two shifts when the hours pass 6h", () => {
    const rebalanced = rebalanceForTotal(continuous(480, 840), 480);

    assert.notEqual(rebalanced.afternoon, null);
    assert.equal(isValidWorkSchedule(rebalanced, 480), true);
  });

  it("keeps the length when either end of the shift moves", () => {
    const current = { start: 480, end: 720 };

    assert.deepEqual(
      resolveContinuousSchedule(current, { start: 540, end: 720 }, 240),
      continuous(540, 780),
    );
    assert.deepEqual(
      resolveContinuousSchedule(current, { start: 480, end: 780 }, 240),
      continuous(540, 780),
    );
  });
});

describe("split work schedule", () => {
  it("still requires a 1h break", () => {
    assert.equal(
      isValidWorkSchedule(
        {
          morning: { start: 540, end: 720 },
          afternoon: { start: 750, end: 930 },
        },
        360,
      ),
      false,
    );
  });
});
