import {
  MAX_HOURS_PER_DAY,
  MIN_HOURS_PER_DAY,
  MIN_INTERNSHIP_HOURS,
  WORKDAYS_PER_WEEK,
} from "@papelada-estagio/constants";
import {
  addDays,
  formatDatePtBr,
  getDayOfWeekPtBr,
  parseIsoDate,
  toIsoString,
} from "./dateUtils";
import { isHoliday, isWorkday } from "./holidays";

export interface DateValidationResult {
  isValid: boolean;
  date?: Date;
  error?: string;
}

export interface DateCalculationResult {
  isValid: boolean;
  totalHours: number;
  totalWorkdays: number;
  endDate: string;
  weeksNeeded: number;
  errors: string[];
}

export function validateDate(isoDate: string): DateValidationResult {
  if (!isoDate) {
    return { isValid: false, error: "Data não informada" };
  }

  const date = parseIsoDate(isoDate);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: "Data inválida" };
  }

  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isValid: false,
      error: `Data inválida: ${getDayOfWeekPtBr(date)} é fim de semana`,
    };
  }

  const holidayCheck = isHoliday(date);
  if (holidayCheck.isHoliday) {
    return {
      isValid: false,
      error: `Data inválida: ${holidayCheck.name}`,
    };
  }

  return { isValid: true, date };
}

export function countWorkdays(startIso: string, endIso: string): number {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  let count = 0;
  let current = new Date(start);

  while (current <= end) {
    if (isWorkday(current)) {
      count++;
    }
    current = addDays(current, 1);
  }

  return count;
}

export function calculateEndDate(
  startIso: string,
  hoursPerDay: number,
  minTotalHours: number = MIN_INTERNSHIP_HOURS,
): DateCalculationResult {
  const errors: string[] = [];

  const startValidation = validateDate(startIso);
  if (!startValidation.isValid) {
    return {
      isValid: false,
      totalHours: 0,
      totalWorkdays: 0,
      endDate: "",
      weeksNeeded: 0,
      errors: [startValidation.error!],
    };
  }

  if (hoursPerDay < MIN_HOURS_PER_DAY || hoursPerDay > MAX_HOURS_PER_DAY) {
    errors.push(
      `Horas por dia deve ser entre ${MIN_HOURS_PER_DAY} e ${MAX_HOURS_PER_DAY}`,
    );
    return {
      isValid: false,
      totalHours: 0,
      totalWorkdays: 0,
      endDate: "",
      weeksNeeded: 0,
      errors,
    };
  }

  const workdaysNeeded = Math.ceil(minTotalHours / hoursPerDay);
  const hoursPerWeek = hoursPerDay * WORKDAYS_PER_WEEK;
  const weeksNeeded = Math.ceil(minTotalHours / hoursPerWeek);

  const start = parseIsoDate(startIso);
  let current = new Date(start);
  let workdaysCounted = 0;

  while (workdaysCounted < workdaysNeeded) {
    if (isWorkday(current)) {
      workdaysCounted++;
      if (workdaysCounted === workdaysNeeded) {
        break;
      }
    }
    current = addDays(current, 1);
  }

  const endDate = toIsoString(current);

  return {
    isValid: true,
    totalHours: workdaysCounted * hoursPerDay,
    totalWorkdays: workdaysCounted,
    endDate,
    weeksNeeded,
    errors: [],
  };
}

export function validateInternshipPeriod(
  startIso: string,
  endIso: string,
  hoursPerDay: number,
): DateValidationResult {
  const startValidation = validateDate(startIso);
  if (!startValidation.isValid) {
    return startValidation;
  }

  const endValidation = validateDate(endIso);
  if (!endValidation.isValid) {
    return endValidation;
  }

  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  if (end < start) {
    return {
      valid: false,
      error: "Data de término deve ser posterior à data de início",
    };
  }

  const workdays = countWorkdays(startIso, endIso);
  const totalHours = workdays * hoursPerDay;

  if (totalHours < MIN_INTERNSHIP_HOURS) {
    return {
      isValid: false,
      error: `Período insuficiente: ${totalHours}h (mínimo ${MIN_INTERNSHIP_HOURS}h). Adicione mais ${MIN_INTERNSHIP_HOURS - totalHours}h.`,
    };
  }

  return { isValid: true };
}

export interface PeriodInfo {
  workdays: number;
  totalHours: number;
  formattedPeriod: string;
  meetsMinimumHours: boolean;
}

export function getPeriodInfo(
  startDate: string,
  endDate: string,
  hoursPerDay: number,
): PeriodInfo | null {
  if (!startDate || !endDate || !hoursPerDay) return null;

  const workdays = countWorkdays(startDate, endDate);
  const totalHours = workdays * hoursPerDay;

  return {
    workdays,
    totalHours,
    formattedPeriod: `${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`,
    meetsMinimumHours: totalHours >= MIN_INTERNSHIP_HOURS,
  };
}
