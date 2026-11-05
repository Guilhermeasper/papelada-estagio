import type { IInternshipFraming } from "@papelada-estagio/types";
import { MAX_HOURS_PER_DAY } from "./business";

export const COURSES = [
  "Ciência da Computação",
  "Engenharia da Computação",
  "Sistemas de Informação",
  "Inteligência Artificial",
] as const;
export type Course = (typeof COURSES)[number];

export const CURRICULUM_PROFILES = ["anterior", "novo"] as const;
export type CurriculumProfile = (typeof CURRICULUM_PROFILES)[number];

export const INTERNSHIP_REGIMES = ["clt", "servidor", "socio", "tce"] as const;
export type InternshipRegime = (typeof INTERNSHIP_REGIMES)[number];

export type PrerequisiteId =
  | "ccAnterior"
  | "ecAnterior"
  | "ecNovo"
  | "siAnterior"
  | "siNovo";

export type MandatoryRule =
  | { kind: "fixed"; hours: number; prerequisiteId: PrerequisiteId }
  | { kind: "declared"; prerequisiteId: PrerequisiteId }
  | { kind: "none" };

const NO_MANDATORY_INTERNSHIP: MandatoryRule = { kind: "none" };

// Regulamentos de estágio de cada curso, publicados na página da SecGrad.
// O regulamento de SI do perfil anterior exige login no Drive, por isso a carga
// vem do aluno: docs/regras-de-estagio.md registra essa pendência.
export const MANDATORY_INTERNSHIP_RULES: Record<
  Course,
  Record<CurriculumProfile, MandatoryRule>
> = {
  "Ciência da Computação": {
    anterior: { kind: "fixed", hours: 300, prerequisiteId: "ccAnterior" },
    novo: NO_MANDATORY_INTERNSHIP,
  },
  "Engenharia da Computação": {
    anterior: { kind: "fixed", hours: 300, prerequisiteId: "ecAnterior" },
    novo: { kind: "fixed", hours: 180, prerequisiteId: "ecNovo" },
  },
  "Sistemas de Informação": {
    anterior: { kind: "declared", prerequisiteId: "siAnterior" },
    novo: { kind: "fixed", hours: 75, prerequisiteId: "siNovo" },
  },
  "Inteligência Artificial": {
    anterior: NO_MANDATORY_INTERNSHIP,
    novo: NO_MANDATORY_INTERNSHIP,
  },
};

export interface RegimeRule {
  maxHoursPerDay: number;
  hasSupervisor: boolean;
  requiresTce: boolean;
}

// Lei 11.788/2008, art. 10, e Res. CEPE 20/2015, art. 18: 6h/dia com TCE.
// Página da SecGrad: até 8h/dia para quem tem vínculo ou é sócio.
export const REGIME_RULES: Record<InternshipRegime, RegimeRule> = {
  clt: {
    maxHoursPerDay: MAX_HOURS_PER_DAY,
    hasSupervisor: true,
    requiresTce: false,
  },
  servidor: {
    maxHoursPerDay: MAX_HOURS_PER_DAY,
    hasSupervisor: true,
    requiresTce: false,
  },
  socio: {
    maxHoursPerDay: MAX_HOURS_PER_DAY,
    hasSupervisor: false,
    requiresTce: false,
  },
  tce: {
    maxHoursPerDay: 6,
    hasSupervisor: true,
    requiresTce: true,
  },
};

export interface InternshipRules extends RegimeRule {
  course: Course;
  regime: InternshipRegime;
  requiredHours: number;
  prerequisiteId: PrerequisiteId;
}

export function hasMandatoryInternship(
  course: Course,
  profile: CurriculumProfile,
): boolean {
  return MANDATORY_INTERNSHIP_RULES[course][profile].kind !== "none";
}

export function resolveInternshipRules(
  framing: IInternshipFraming,
): InternshipRules | null {
  const { course, curriculumProfile, regime, declaredRequiredHours } = framing;
  if (!course || !curriculumProfile || !regime) return null;

  const rule = MANDATORY_INTERNSHIP_RULES[course][curriculumProfile];
  if (rule.kind === "none") return null;

  const requiredHours =
    rule.kind === "fixed" ? rule.hours : declaredRequiredHours;
  if (!requiredHours) return null;

  return {
    ...REGIME_RULES[regime],
    course,
    regime,
    requiredHours,
    prerequisiteId: rule.prerequisiteId,
  };
}

export function regimeHasSupervisor(regime: InternshipRegime | ""): boolean {
  return regime === "" || REGIME_RULES[regime].hasSupervisor;
}
