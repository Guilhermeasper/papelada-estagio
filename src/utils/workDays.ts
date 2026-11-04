import { MAX_WEEKDAY, MIN_WEEKDAY } from "@papelada-estagio/constants/business";
import { WEEKDAY_NAMES_PT_BR } from "./dateUtils";

const WEEKDAY_PATTERNS = [
  /\bdomingos?\b/g,
  /\bsegunda\b/g,
  /\bterca\b/g,
  /\bquarta\b/g,
  /\bquinta\b/g,
  /\bsexta\b/g,
  /\bsabados?\b/g,
];

function normalizeDays(days: number[]): number[] {
  return Array.from(new Set(days))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((first, second) => first - second);
}

function groupRuns(days: number[]): number[][] {
  const runs: number[][] = [];

  for (const day of days) {
    const last = runs.at(-1);
    if (last && day === last[last.length - 1] + 1) {
      last.push(day);
      continue;
    }
    runs.push([day]);
  }

  return runs;
}

export const WEEKDAY_OPTIONS = Array.from(
  { length: MAX_WEEKDAY - MIN_WEEKDAY + 1 },
  (_, index) => ({
    value: MIN_WEEKDAY + index,
    label: WEEKDAY_NAMES_PT_BR[MIN_WEEKDAY + index],
  }),
);

export function toWeekdayRange(days: number[]): number[] {
  return normalizeDays(days).filter(
    (day) => day >= MIN_WEEKDAY && day <= MAX_WEEKDAY,
  );
}

export function formatWorkDays(days: number[]): string {
  const sorted = normalizeDays(days);
  if (sorted.length === 0) return "";

  const tokens = groupRuns(sorted).flatMap((run) => {
    if (run.length < 3) return run.map((day) => WEEKDAY_NAMES_PT_BR[day]);
    const first = WEEKDAY_NAMES_PT_BR[run[0]];
    const last = WEEKDAY_NAMES_PT_BR[run[run.length - 1]];
    return [`${first} a ${last}`];
  });

  if (tokens.length === 1) return tokens[0];

  return `${tokens.slice(0, -1).join(", ")} e ${tokens[tokens.length - 1]}`;
}

export function parseLegacyWorkDays(value: string): number[] | null {
  if (!value) return null;

  const normalized = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const found: { start: number; end: number; day: number }[] = [];

  WEEKDAY_PATTERNS.forEach((pattern, day) => {
    for (const match of normalized.matchAll(pattern)) {
      found.push({
        start: match.index,
        end: match.index + match[0].length,
        day,
      });
    }
  });

  if (found.length === 0) return null;

  found.sort((first, second) => first.start - second.start);

  const days = new Set<number>();

  found.forEach((entry, position) => {
    days.add(entry.day);
    if (position === 0) return;
    const previous = found[position - 1];

    const between = normalized.slice(previous.end, entry.start);
    if (!/\b(a|ate)\b/.test(between)) return;

    for (let day = previous.day + 1; day < entry.day; day++) days.add(day);
  });

  return normalizeDays(Array.from(days));
}
