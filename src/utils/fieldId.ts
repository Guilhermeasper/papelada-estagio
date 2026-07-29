export function toFieldId(label?: string, id?: string): string | undefined {
  return id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
}
