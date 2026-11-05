const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function formatDatePtBr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateLong(isoDate?: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} de ${MONTHS_PT[month - 1]} de ${year}`;
}

export function getMonthName(month: number): string {
  return MONTHS_PT[month - 1] || "";
}

export function splitTextIntoLines(
  text: string | undefined,
  numLines: number,
  charsPerLine = 84,
): string[] {
  if (!text) {
    return Array<string>(numLines).fill("\u00A0");
  }

  const lines: string[] = [];
  let remaining = text;

  for (let i = 0; i < numLines; i++) {
    if (remaining.length === 0) {
      lines.push("\u00A0");
    } else if (remaining.length <= charsPerLine) {
      lines.push(remaining);
      remaining = "";
    } else {
      let breakPoint = charsPerLine;
      while (breakPoint > 0 && remaining[breakPoint] !== " ") {
        breakPoint--;
      }
      if (breakPoint === 0) breakPoint = charsPerLine;

      lines.push(remaining.substring(0, breakPoint).trim());
      remaining = remaining.substring(breakPoint).trim();
    }
  }

  return lines;
}

export type Rating = "Ótimo" | "Bom" | "Regular" | "Ruim";

const RATING_OPTIONS: Rating[] = ["Ótimo", "Bom", "Regular", "Ruim"];

export function renderRating(selected?: Rating): string {
  return RATING_OPTIONS.map(
    (option) => `${option} ( ${option === selected ? "X" : " "} )`,
  ).join("      ");
}
