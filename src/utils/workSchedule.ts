import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  DEFAULT_SCHEDULE_START_MINUTES,
  MIN_BREAK_MINUTES,
  MIN_PERIOD_MINUTES,
  SCHEDULE_STEP_MINUTES,
} from "@papelada-estagio/constants";
import { IWorkSchedule } from "@papelada-estagio/types";

export type WorkScheduleThumb =
  | "morningStart"
  | "morningEnd"
  | "afternoonStart"
  | "afternoonEnd";

interface IScheduleFrame {
  start: number;
  morningMinutes: number;
  breakMinutes: number;
}

const THUMB_ORDER: WorkScheduleThumb[] = [
  "morningEnd",
  "afternoonStart",
  "morningStart",
  "afternoonEnd",
];

const MAX_TOTAL_MINUTES =
  DAY_END_MINUTES - DAY_START_MINUTES - MIN_BREAK_MINUTES;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function snap(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / SCHEDULE_STEP_MINUTES) * SCHEDULE_STEP_MINUTES;
}

function normalizeTotal(totalMinutes: number): number {
  return clamp(snap(totalMinutes), MIN_PERIOD_MINUTES * 2, MAX_TOTAL_MINUTES);
}

function readThumb(schedule: IWorkSchedule, thumb: WorkScheduleThumb): number {
  switch (thumb) {
    case "morningStart":
      return schedule.morning.start;
    case "morningEnd":
      return schedule.morning.end;
    case "afternoonStart":
      return schedule.afternoon.start;
    case "afternoonEnd":
      return schedule.afternoon.end;
  }
}

function toFrame(schedule: IWorkSchedule): IScheduleFrame {
  return {
    start: schedule.morning.start,
    morningMinutes: schedule.morning.end - schedule.morning.start,
    breakMinutes: schedule.afternoon.start - schedule.morning.end,
  };
}

function fromFrame(frame: IScheduleFrame, total: number): IWorkSchedule {
  const morningEnd = frame.start + frame.morningMinutes;
  const afternoonStart = morningEnd + frame.breakMinutes;

  return {
    morning: { start: frame.start, end: morningEnd },
    afternoon: {
      start: afternoonStart,
      end: afternoonStart + (total - frame.morningMinutes),
    },
  };
}

function sanitizeFrame(frame: IScheduleFrame, total: number): IScheduleFrame {
  const morningMinutes = clamp(
    snap(frame.morningMinutes),
    MIN_PERIOD_MINUTES,
    total - MIN_PERIOD_MINUTES,
  );
  const breakMinutes = clamp(
    snap(frame.breakMinutes),
    MIN_BREAK_MINUTES,
    DAY_END_MINUTES - DAY_START_MINUTES - total,
  );
  const start = clamp(
    snap(frame.start),
    DAY_START_MINUTES,
    DAY_END_MINUTES - breakMinutes - total,
  );

  return { start, morningMinutes, breakMinutes };
}

function detectMovedThumb(
  current: IWorkSchedule,
  next: IWorkSchedule,
): WorkScheduleThumb | null {
  let moved: WorkScheduleThumb | null = null;
  let largest = 0;

  for (const thumb of THUMB_ORDER) {
    const delta = Math.abs(readThumb(next, thumb) - readThumb(current, thumb));
    if (delta > largest) {
      largest = delta;
      moved = thumb;
    }
  }

  return moved;
}

function translateTo(
  frame: IScheduleFrame,
  start: number,
  total: number,
): IScheduleFrame {
  return {
    ...frame,
    start: clamp(
      start,
      DAY_START_MINUTES,
      DAY_END_MINUTES - frame.breakMinutes - total,
    ),
  };
}

export function resolveWorkSchedule(
  current: IWorkSchedule,
  next: IWorkSchedule,
  totalMinutes: number,
): IWorkSchedule {
  const total = normalizeTotal(totalMinutes);
  const frame = sanitizeFrame(toFrame(current), total);
  const thumb = detectMovedThumb(current, next);

  if (!thumb) return fromFrame(frame, total);

  const target = snap(readThumb(next, thumb));

  switch (thumb) {
    case "morningStart":
      return fromFrame(translateTo(frame, target, total), total);

    case "afternoonEnd":
      return fromFrame(
        translateTo(frame, target - frame.breakMinutes - total, total),
        total,
      );

    case "morningEnd":
      return fromFrame(
        {
          ...frame,
          morningMinutes: clamp(
            target - frame.start,
            MIN_PERIOD_MINUTES,
            total - MIN_PERIOD_MINUTES,
          ),
        },
        total,
      );

    case "afternoonStart":
      return fromFrame(
        {
          ...frame,
          breakMinutes: clamp(
            target - frame.start - frame.morningMinutes,
            MIN_BREAK_MINUTES,
            DAY_END_MINUTES - total - frame.start,
          ),
        },
        total,
      );
  }
}

export function rebalanceForTotal(
  schedule: IWorkSchedule,
  totalMinutes: number,
): IWorkSchedule {
  const total = normalizeTotal(totalMinutes);
  return fromFrame(sanitizeFrame(toFrame(schedule), total), total);
}

export function defaultWorkSchedule(totalMinutes: number): IWorkSchedule {
  const total = normalizeTotal(totalMinutes);
  const frame = sanitizeFrame(
    {
      start: DEFAULT_SCHEDULE_START_MINUTES,
      morningMinutes: snap(total / 2),
      breakMinutes: MIN_BREAK_MINUTES,
    },
    total,
  );

  return fromFrame(frame, total);
}

export function isValidWorkSchedule(
  schedule: IWorkSchedule | null | undefined,
  totalMinutes: number,
): boolean {
  if (!schedule?.morning || !schedule.afternoon) return false;

  const values = [
    schedule.morning.start,
    schedule.morning.end,
    schedule.afternoon.start,
    schedule.afternoon.end,
  ];

  if (values.some((value) => !Number.isInteger(value))) return false;
  if (values.some((value) => value % SCHEDULE_STEP_MINUTES !== 0)) return false;

  const morningMinutes = schedule.morning.end - schedule.morning.start;
  const afternoonMinutes = schedule.afternoon.end - schedule.afternoon.start;
  const breakMinutes = schedule.afternoon.start - schedule.morning.end;

  if (schedule.morning.start < DAY_START_MINUTES) return false;
  if (schedule.afternoon.end > DAY_END_MINUTES) return false;
  if (morningMinutes < MIN_PERIOD_MINUTES) return false;
  if (afternoonMinutes < MIN_PERIOD_MINUTES) return false;
  if (breakMinutes < MIN_BREAK_MINUTES) return false;

  return morningMinutes + afternoonMinutes === totalMinutes;
}

export function formatMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h${String(remainder).padStart(2, "0")}`;
}

export function formatWorkSchedule(schedule: IWorkSchedule): string {
  const morningStart = formatMinutes(schedule.morning.start);
  const morningEnd = formatMinutes(schedule.morning.end);
  const afternoonStart = formatMinutes(schedule.afternoon.start);
  const afternoonEnd = formatMinutes(schedule.afternoon.end);

  return `Das ${morningStart}h às ${morningEnd}h e ${afternoonStart}h às ${afternoonEnd}h`;
}

export function parseLegacyWorkSchedule(
  value: string,
  totalMinutes: number,
): IWorkSchedule | null {
  if (!value) return null;

  const matches = Array.from(value.matchAll(/(\d{1,2}):(\d{2})/g));
  if (matches.length !== 4) return null;

  const minutes = matches.map((match) => {
    const hours = Number(match[1]);
    const remainder = Number(match[2]);
    if (hours > 23 || remainder > 59) return Number.NaN;
    return hours * 60 + remainder;
  });

  if (minutes.some((entry) => Number.isNaN(entry))) return null;

  const schedule: IWorkSchedule = {
    morning: { start: minutes[0], end: minutes[1] },
    afternoon: { start: minutes[2], end: minutes[3] },
  };

  return isValidWorkSchedule(schedule, totalMinutes) ? schedule : null;
}
