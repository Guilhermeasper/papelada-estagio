

import { MIN_INTERNSHIP_HOURS } from '../constants';
import {
  calculateEndDate,
  countWorkdays,
  DateCalculationResult,
  DateValidationResult,
  validateDate,
  validateInternshipPeriod
} from '../utils/dateCalculator';
import { formatDatePtBr } from '../utils/dateUtils';

export interface PeriodInfo {
  workdays: number;
  totalHours: number;
  formattedPeriod: string;
  meetsMinimumHours: boolean;
}

export const dateService = {

  calculateEndDate(
    startDate: string, 
    hoursPerDay: number, 
    minHours: number = MIN_INTERNSHIP_HOURS
  ): DateCalculationResult {
    return calculateEndDate(startDate, hoursPerDay, minHours);
  },


  validateDate(date: string): DateValidationResult {
    return validateDate(date);
  },


  validatePeriod(
    startDate: string, 
    endDate: string, 
    hoursPerDay: number
  ): DateValidationResult {
    return validateInternshipPeriod(startDate, endDate, hoursPerDay);
  },


  countWorkdays(startDate: string, endDate: string): number {
    return countWorkdays(startDate, endDate);
  },


  formatPeriod(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '';
    return `${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`;
  },


  getPeriodInfo(
    startDate: string, 
    endDate: string, 
    hoursPerDay: number
  ): PeriodInfo | null {
    if (!startDate || !endDate || !hoursPerDay) return null;
    
    const workdays = countWorkdays(startDate, endDate);
    const totalHours = workdays * hoursPerDay;
    
    return {
      workdays,
      totalHours,
      formattedPeriod: this.formatPeriod(startDate, endDate),
      meetsMinimumHours: totalHours >= MIN_INTERNSHIP_HOURS,
    };
  },
};
