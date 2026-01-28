/**
 * Utilitários para formatação de datas
 */

/**
 * Converte data ISO (YYYY-MM-DD) para formato PT-BR (DD/MM/YYYY)
 */
export function formatDatePtBr(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Converte data PT-BR (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 */
export function formatDateIso(ptBrDate: string): string {
  if (!ptBrDate) return '';
  const [day, month, year] = ptBrDate.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Formata período entre duas datas
 * Ex: "20/11/2025 a 30/11/2025"
 */
export function formatPeriod(startIso: string, endIso: string): string {
  return `${formatDatePtBr(startIso)} a ${formatDatePtBr(endIso)}`;
}

/**
 * Retorna o dia da semana em português
 */
export function getDayOfWeekPtBr(date: Date): string {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  return days[date.getDay()];
}

/**
 * Verifica se a data é um fim de semana (sábado ou domingo)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

/**
 * Cria uma data a partir de string ISO sem problemas de timezone
 */
export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Converte Date para string ISO (YYYY-MM-DD)
 */
export function toIsoString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
