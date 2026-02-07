

interface FixedHoliday {
  day: number;
  month: number;
  name: string;
  scope: 'nacional' | 'estadual' | 'municipal';
}


const FIXED_HOLIDAYS: FixedHoliday[] = [

  { day: 1, month: 1, name: 'Confraternização Universal', scope: 'nacional' },
  { day: 21, month: 4, name: 'Tiradentes', scope: 'nacional' },
  { day: 1, month: 5, name: 'Dia do Trabalho', scope: 'nacional' },
  { day: 7, month: 9, name: 'Independência do Brasil', scope: 'nacional' },
  { day: 12, month: 10, name: 'Nossa Senhora Aparecida', scope: 'nacional' },
  { day: 2, month: 11, name: 'Finados', scope: 'nacional' },
  { day: 15, month: 11, name: 'Proclamação da República', scope: 'nacional' },
  { day: 25, month: 12, name: 'Natal', scope: 'nacional' },
  

  { day: 6, month: 3, name: 'Revolução Pernambucana', scope: 'estadual' },
  { day: 24, month: 6, name: 'São João', scope: 'estadual' },
  

  { day: 12, month: 3, name: 'Aniversário de Recife', scope: 'municipal' },
];


function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}


function getMovableHolidays(year: number): { date: Date; name: string }[] {
  const easter = calculateEaster(year);
  

  const carnavalTerca = new Date(easter);
  carnavalTerca.setDate(easter.getDate() - 47);
  
  const carnavalSegunda = new Date(carnavalTerca);
  carnavalSegunda.setDate(carnavalTerca.getDate() - 1);
  

  const quartaCinzas = new Date(carnavalTerca);
  quartaCinzas.setDate(carnavalTerca.getDate() + 1);
  

  const sextaSanta = new Date(easter);
  sextaSanta.setDate(easter.getDate() - 2);
  

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  
  return [
    { date: carnavalSegunda, name: 'Carnaval (Segunda)' },
    { date: carnavalTerca, name: 'Carnaval (Terça)' },
    { date: quartaCinzas, name: 'Quarta-feira de Cinzas' },
    { date: sextaSanta, name: 'Sexta-feira Santa' },
    { date: easter, name: 'Páscoa' },
    { date: corpusChristi, name: 'Corpus Christi' },
  ];
}


export function isHoliday(date: Date): { isHoliday: boolean; name?: string } {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  

  const fixedHoliday = FIXED_HOLIDAYS.find(
    (h) => h.day === day && h.month === month
  );
  if (fixedHoliday) {
    return { isHoliday: true, name: fixedHoliday.name };
  }
  

  const movableHolidays = getMovableHolidays(year);
  const movableHoliday = movableHolidays.find(
    (h) =>
      h.date.getDate() === day &&
      h.date.getMonth() + 1 === month &&
      h.date.getFullYear() === year
  );
  if (movableHoliday) {
    return { isHoliday: true, name: movableHoliday.name };
  }
  
  return { isHoliday: false };
}


export function getHolidaysForYear(year: number): { date: Date; name: string }[] {
  const holidays: { date: Date; name: string }[] = [];
  

  for (const h of FIXED_HOLIDAYS) {
    holidays.push({
      date: new Date(year, h.month - 1, h.day),
      name: h.name,
    });
  }
  

  holidays.push(...getMovableHolidays(year));
  

  holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return holidays;
}


export function isWorkday(date: Date): boolean {
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  
  if (isWeekend) return false;
  
  return !isHoliday(date).isHoliday;
}
