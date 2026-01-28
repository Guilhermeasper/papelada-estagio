/**
 * DateService - Encapsulates date calculations and validation
 * Single source of truth for all date-related business logic
 */

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
  /**
   * Calculates the end date based on start date and hours per day
   */
  calculateEndDate(
    startDate: string, 
    hoursPerDay: number, 
    minHours: number = MIN_INTERNSHIP_HOURS
  ): DateCalculationResult {
    return calculateEndDate(startDate, hoursPerDay, minHours);
  },

  /**
   * Validates if a date is valid for internship (not weekend/holiday)
   */
  validateDate(date: string): DateValidationResult {
    return validateDate(date);
  },

  /**
   * Validates if a date range meets internship requirements
   */
  validatePeriod(
    startDate: string, 
    endDate: string, 
    hoursPerDay: number
  ): DateValidationResult {
    return validateInternshipPeriod(startDate, endDate, hoursPerDay);
  },

  /**
   * Counts workdays between two dates
   */
  countWorkdays(startDate: string, endDate: string): number {
    return countWorkdays(startDate, endDate);
  },

  /**
   * Formats a date range as a Portuguese string
   */
  formatPeriod(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return '';
    return `${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`;
  },

  /**
   * Gets complete period information for display
   */
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
