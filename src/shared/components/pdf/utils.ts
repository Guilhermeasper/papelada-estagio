/**
 * Shared PDF Utilities
 * Date formatting, text processing, and helper functions
 */

// ============================================
// Date Formatting
// ============================================

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/**
 * Format ISO date to PT-BR format (dd/mm/yyyy)
 */
export function formatDatePtBr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Format ISO date to long PT-BR format (d de Mês de yyyy)
 */
export function formatDateLong(isoDate?: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = MONTHS_PT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Get month name in Portuguese (1-indexed)
 */
export function getMonthName(month: number): string {
  return MONTHS_PT[month - 1] || '';
}

/**
 * Format ISO date to full date format (d de Mês de yyyy)
 */
export function formatFullDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} de ${getMonthName(month)} de ${year}`;
}

// ============================================
// Text Processing
// ============================================

/**
 * Split text into lines for comments tables
 * Returns array of strings, padding with non-breaking spaces if needed
 */
export function splitTextIntoLines(text: string | undefined, numLines: number, charsPerLine = 84): string[] {
  if (!text) {
    return Array(numLines).fill('\u00A0');
  }
  
  const lines: string[] = [];
  let remaining = text;
  
  for (let i = 0; i < numLines; i++) {
    if (remaining.length === 0) {
      lines.push('\u00A0');
    } else if (remaining.length <= charsPerLine) {
      lines.push(remaining);
      remaining = '';
    } else {
      // Find a good break point (space) near the limit
      let breakPoint = charsPerLine;
      while (breakPoint > 0 && remaining[breakPoint] !== ' ') {
        breakPoint--;
      }
      if (breakPoint === 0) breakPoint = charsPerLine;
      
      lines.push(remaining.substring(0, breakPoint).trim());
      remaining = remaining.substring(breakPoint).trim();
    }
  }
  
  return lines;
}

// ============================================
// Rating System
// ============================================

export type Rating = 'Ótimo' | 'Bom' | 'Regular' | 'Ruim';

const RATING_OPTIONS: Rating[] = ['Ótimo', 'Bom', 'Regular', 'Ruim'];

/**
 * Render rating options with selected value marked
 */
export function renderRating(selected?: Rating): string {
  return RATING_OPTIONS.map((option) => 
    `${option} ( ${option === selected ? 'X' : ' '} )`
  ).join('      ');
}
