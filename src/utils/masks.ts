export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function maskEnrollmentYear(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const year = parts[0]?.slice(0, 4) || "";
  const semester = parts[1]?.slice(0, 1) || "";

  if (cleaned.includes(".") && year.length === 4) {
    return semester ? `${year}.${semester}` : `${year}.`;
  }
  return year;
}

export type MaskType = "phone" | "cnpj" | "cpf" | "enrollmentYear";

export function applyMask(value: string, mask: MaskType): string {
  switch (mask) {
    case "phone":
      return maskPhone(value);
    case "cnpj":
      return maskCnpj(value);
    case "cpf":
      return maskCpf(value);
    case "enrollmentYear":
      return maskEnrollmentYear(value);
    default:
      return value;
  }
}
