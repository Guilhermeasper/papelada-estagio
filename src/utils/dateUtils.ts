export function formatDatePtBr(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function formatPeriod(startIso: string, endIso: string): string {
  if (!startIso && !endIso) return "";
  if (!startIso || !endIso) return formatDatePtBr(startIso || endIso);
  return `${formatDatePtBr(startIso)} a ${formatDatePtBr(endIso)}`;
}

const PT_BR_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const LEGACY_PERIOD_SEPARATOR = /\s+a\s+/i;

export function formatDateIso(ptBrDate: string): string {
  const match = PT_BR_DATE.exec(ptBrDate.trim());
  if (!match) return "";

  const [, day, month, year] = match;
  const isoDate = `${year}-${month}-${day}`;
  const parsed = parseIsoDate(isoDate);

  if (Number.isNaN(parsed.getTime())) return "";
  if (parsed.getDate() !== Number(day)) return "";
  if (parsed.getMonth() !== Number(month) - 1) return "";

  return isoDate;
}

export interface LegacyPeriodParts {
  periodStart: string;
  periodEnd: string;
}

export function parseLegacyPeriod(period: unknown): LegacyPeriodParts {
  const empty = { periodStart: "", periodEnd: "" };
  if (typeof period !== "string") return empty;

  const parts = period.split(LEGACY_PERIOD_SEPARATOR);
  if (parts.length !== 2) return empty;

  const periodStart = formatDateIso(parts[0]);
  const periodEnd = formatDateIso(parts[1]);

  return periodStart && periodEnd ? { periodStart, periodEnd } : empty;
}

export const WEEKDAY_NAMES_PT_BR = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function getDayOfWeekPtBr(date: Date): string {
  return WEEKDAY_NAMES_PT_BR[date.getDay()];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
