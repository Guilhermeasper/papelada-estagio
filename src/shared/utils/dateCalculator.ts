/**
 * Calculadora de datas para estágio
 * Calcula data final baseado em horas mínimas (300h) e dias úteis
 */

import { MAX_HOURS_PER_DAY, MIN_HOURS_PER_DAY, MIN_INTERNSHIP_HOURS, WORKDAYS_PER_WEEK } from '../constants';
import { addDays, getDayOfWeekPtBr, parseIsoDate, toIsoString } from './dateUtils';
import { isHoliday, isWorkday } from './holidays';

export interface DateValidationResult {
  valid: boolean;
  error?: string;
}

export interface DateCalculationResult {
  isValid: boolean;
  totalHours: number;
  totalWorkdays: number;
  endDate: string; // ISO format
  weeksNeeded: number;
  errors: string[];
}

/**
 * Valida se uma data é válida para início ou fim de estágio
 * - Não pode ser fim de semana
 * - Não pode ser feriado
 */
export function validateDate(isoDate: string): DateValidationResult {
  if (!isoDate) {
    return { valid: false, error: 'Data é obrigatória' };
  }
  
  const date = parseIsoDate(isoDate);
  
  // Verifica fim de semana
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      valid: false,
      error: `Data inválida: ${getDayOfWeekPtBr(date)} é fim de semana`,
    };
  }
  
  // Verifica feriado
  const holidayCheck = isHoliday(date);
  if (holidayCheck.isHoliday) {
    return {
      valid: false,
      error: `Data inválida: ${holidayCheck.name}`,
    };
  }
  
  return { valid: true };
}

/**
 * Counts the number of workdays between two dates (inclusive)
 * 
 * A workday is defined as:
 * - Not a Saturday or Sunday
 * - Not a Brazilian national holiday
 * 
 * @param startIso - Start date in ISO format (YYYY-MM-DD)
 * @param endIso - End date in ISO format (YYYY-MM-DD)
 * @returns Number of workdays in the range (inclusive of both start and end if they are workdays)
 * 
 * @example
 * // Count workdays in January 2026
 * countWorkdays('2026-01-05', '2026-01-09') // Returns 5 (Mon-Fri)
 * countWorkdays('2026-01-01', '2026-01-05') // Returns 2 (excludes New Year holiday and weekend)
 * 
 * @note For very long date ranges (years), this uses linear iteration which may be slow.
 * Consider caching results or using batch processing for such cases.
 */
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

/**
 * Calcula a data final do estágio baseado em:
 * - Data de início
 * - Horas por dia
 * - Mínimo de 300 horas
 * 
 * Pula finais de semana e feriados automaticamente
 */
export function calculateEndDate(
  startIso: string,
  hoursPerDay: number,
  minTotalHours: number = MIN_INTERNSHIP_HOURS
): DateCalculationResult {
  const errors: string[] = [];
  
  // Valida data de início
  const startValidation = validateDate(startIso);
  if (!startValidation.valid) {
    return {
      isValid: false,
      totalHours: 0,
      totalWorkdays: 0,
      endDate: '',
      weeksNeeded: 0,
      errors: [startValidation.error!],
    };
  }
  
  // Valida horas por dia
  if (hoursPerDay < MIN_HOURS_PER_DAY || hoursPerDay > MAX_HOURS_PER_DAY) {
    errors.push(`Horas por dia deve ser entre ${MIN_HOURS_PER_DAY} e ${MAX_HOURS_PER_DAY}`);
    return {
      isValid: false,
      totalHours: 0,
      totalWorkdays: 0,
      endDate: '',
      weeksNeeded: 0,
      errors,
    };
  }
  
  // Calcula quantidade de dias úteis necessários
  const workdaysNeeded = Math.ceil(minTotalHours / hoursPerDay);
  const hoursPerWeek = hoursPerDay * WORKDAYS_PER_WEEK;
  const weeksNeeded = Math.ceil(minTotalHours / hoursPerWeek);
  
  // Encontra a data final contando apenas dias úteis
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
  
  // Valida que a data final também não é feriado/fim de semana
  // (já garantido pelo loop acima, mas por segurança)
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

/**
 * Valida se o período do estágio atende aos requisitos mínimos
 */
export function validateInternshipPeriod(
  startIso: string,
  endIso: string,
  hoursPerDay: number
): DateValidationResult {
  // Valida datas individuais
  const startValidation = validateDate(startIso);
  if (!startValidation.valid) {
    return startValidation;
  }
  
  const endValidation = validateDate(endIso);
  if (!endValidation.valid) {
    return endValidation;
  }
  
  // Verifica se data fim é após data início
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  
  if (end < start) {
    return {
      valid: false,
      error: 'Data de término deve ser posterior à data de início',
    };
  }
  
  // Conta dias úteis e calcula horas totais
  const workdays = countWorkdays(startIso, endIso);
  const totalHours = workdays * hoursPerDay;
  
  if (totalHours < MIN_INTERNSHIP_HOURS) {
    return {
      valid: false,
      error: `Período insuficiente: ${totalHours}h (mínimo ${MIN_INTERNSHIP_HOURS}h). Adicione mais ${MIN_INTERNSHIP_HOURS - totalHours}h.`,
    };
  }
  
  return { valid: true };
}
