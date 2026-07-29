import { DEFAULT_WORK_DAYS } from "@papelada-estagio/constants";
import type { IScheduleItem } from "@papelada-estagio/types";
import { isSelectedWorkday } from "./dateCalculator";
import { addDays, parseIsoDate, toIsoString } from "./dateUtils";

export interface ScheduleRange {
  start: string;
  end: string;
}

const MAX_CALENDAR_ITERATIONS = 20000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  return (
    typeof value === "string" &&
    ISO_DATE.test(value) &&
    !Number.isNaN(parseIsoDate(value).getTime())
  );
}

export function listWorkdays(
  startIso: string,
  endIso: string,
  workDays: number[] = DEFAULT_WORK_DAYS,
): string[] {
  if (!isValidIsoDate(startIso) || !isValidIsoDate(endIso)) return [];
  if (workDays.length === 0) return [];

  const end = parseIsoDate(endIso);
  let current = parseIsoDate(startIso);
  if (end < current) return [];

  const days: string[] = [];
  let iterations = 0;

  while (current <= end) {
    if (iterations++ > MAX_CALENDAR_ITERATIONS) return [];
    if (isSelectedWorkday(current, workDays)) {
      days.push(toIsoString(current));
    }
    current = addDays(current, 1);
  }

  return days;
}

export function distributeRange(
  range: ScheduleRange,
  count: number,
  workDays: number[] = DEFAULT_WORK_DAYS,
): ScheduleRange[] | null {
  if (count < 1) return null;

  const days = listWorkdays(range.start, range.end, workDays);
  const total = days.length;
  if (total < count) return null;

  const parts: ScheduleRange[] = [];

  for (let index = 0; index < count; index++) {
    const from = Math.ceil((index * total) / count);
    const to = Math.ceil(((index + 1) * total) / count) - 1;

    parts.push({
      start: index === 0 ? range.start : days[from],
      end: index === count - 1 ? range.end : days[to],
    });
  }

  return parts;
}

export function splitRange(
  range: ScheduleRange,
  workDays: number[] = DEFAULT_WORK_DAYS,
): [ScheduleRange, ScheduleRange] | null {
  const parts = distributeRange(range, 2, workDays);
  return parts ? [parts[0], parts[1]] : null;
}

export function fullPeriodRange(
  startIso: string,
  endIso: string,
): ScheduleRange | null {
  if (!isValidIsoDate(startIso) || !isValidIsoDate(endIso)) return null;
  if (parseIsoDate(endIso) < parseIsoDate(startIso)) return null;
  return { start: startIso, end: endIso };
}

export function buildRanges(
  count: number,
  startIso: string,
  endIso: string,
  workDays: number[] = DEFAULT_WORK_DAYS,
): ScheduleRange[] {
  const blanks = (length: number) =>
    Array.from({ length }, () => ({ start: "", end: "" }));

  const total = Math.max(count, 1);
  const full = fullPeriodRange(startIso, endIso);
  if (!full) return blanks(total);

  const parts = distributeRange(full, total, workDays);
  if (parts) return parts;

  const days = listWorkdays(startIso, endIso, workDays);
  const usable = distributeRange(full, days.length, workDays) ?? [];

  return [...usable, ...blanks(total - usable.length)];
}

export function toRange(item: IScheduleItem): ScheduleRange {
  return { start: item.periodStart, end: item.periodEnd };
}

export function applyRanges(
  items: IScheduleItem[],
  ranges: ScheduleRange[],
): IScheduleItem[] {
  return ranges.map((range, index) => ({
    periodStart: range.start,
    periodEnd: range.end,
    description: items[index]?.description ?? "",
  }));
}

export function removeRangeAt(
  items: IScheduleItem[],
  index: number,
): IScheduleItem[] {
  if (items.length <= 1 || index < 0 || index >= items.length) return items;

  const next = items.map((item) => ({ ...item }));

  if (index > 0) {
    next[index - 1].periodEnd = next[index].periodEnd;
  } else {
    next[1].periodStart = next[0].periodStart;
  }

  next.splice(index, 1);

  return next;
}

export function getScheduleMismatch(
  items: IScheduleItem[],
  startIso: string,
  endIso: string,
): string | null {
  if (!isValidIsoDate(startIso) || !isValidIsoDate(endIso)) return null;
  if (items.length === 0) return null;
  if (items.some((item) => !item.periodStart || !item.periodEnd)) return null;

  if (
    items[0].periodStart !== startIso ||
    items[items.length - 1].periodEnd !== endIso
  ) {
    return "O cronograma não cobre todo o período do estágio informado no passo 4.";
  }

  for (let index = 1; index < items.length; index++) {
    if (
      parseIsoDate(items[index].periodStart) <=
      parseIsoDate(items[index - 1].periodEnd)
    ) {
      return "Há períodos sobrepostos no cronograma.";
    }
  }

  return null;
}
