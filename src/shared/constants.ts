/**
 * Application-wide constants
 * Centralizes magic numbers and business rules
 */

// ============================================
// Business Rules
// ============================================

/** Minimum total hours required for internship */
export const MIN_INTERNSHIP_HOURS = 300;

/** Maximum hours per day allowed */
export const MAX_HOURS_PER_DAY = 8;

/** Minimum hours per day allowed */
export const MIN_HOURS_PER_DAY = 1;

/** Number of workdays per week (Monday to Friday) */
export const WORKDAYS_PER_WEEK = 5;

// ============================================
// Wizard Configuration
// ============================================

/** Total number of wizard steps */
export const MAX_WIZARD_STEPS = 7;

// ============================================
// PDF Generator Limits
// ============================================

/** Maximum items in numbered lists (activities, objectives) */
export const MAX_NUMBERED_LIST_ITEMS = 10;

/** Maximum schedule items */
export const MAX_SCHEDULE_ITEMS = 10;

/** Maximum evaluation grade items */
export const MAX_EVALUATION_GRADES = 10;
