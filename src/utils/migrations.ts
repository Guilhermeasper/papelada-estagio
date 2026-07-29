import {
  DEFAULT_WORK_DAYS,
  MAX_HOURS_PER_DAY,
  MIN_HOURS_PER_DAY,
} from "@papelada-estagio/constants";
import { parseLegacyWorkDays, toWeekdayRange } from "./workDays";
import { defaultWorkSchedule, parseLegacyWorkSchedule } from "./workSchedule";

// Define the shape of the persisted data for each version
// We use 'any' here because old versions might not match current types
export type MigrationFunction = (data: any) => any;

export const CURRENT_DATA_VERSION = 3;

export const MIGRATIONS: Record<number, MigrationFunction> = {
  1: (data) => {
    const endDate = new Date(data.general.endDate);
    endDate.setDate(endDate.getDate() + 12);
    const evaluationDeadline = endDate.toISOString().split("T")[0];

    return {
      ...data,
      supervision: {
        ...data.supervision,
        evaluationDeadline,
      },
    };
  },
  2: (data) => {
    const general = data.general ?? {};

    const hoursPerDay = Math.min(
      Math.max(
        Number(general.hoursPerDay) || MIN_HOURS_PER_DAY,
        MIN_HOURS_PER_DAY,
      ),
      MAX_HOURS_PER_DAY,
    );

    const parsedDays = toWeekdayRange(
      parseLegacyWorkDays(String(general.workDays ?? "")) ?? [],
    );
    const workDays = parsedDays.length > 0 ? parsedDays : DEFAULT_WORK_DAYS;

    const totalMinutes = hoursPerDay * 60;
    const workSchedule =
      parseLegacyWorkSchedule(
        String(general.workSchedule ?? ""),
        totalMinutes,
      ) ?? defaultWorkSchedule(totalMinutes);

    return {
      ...data,
      general: {
        ...general,
        hoursPerDay,
        workDays,
        workSchedule,
      },
    };
  },
};

export function migrateData(data: any, fromVersion: number): any {
  let currentData = data;
  let currentVersion = fromVersion;

  while (currentVersion < CURRENT_DATA_VERSION) {
    const migration = MIGRATIONS[currentVersion];
    if (migration) {
      console.log(
        `Migrating data from version ${currentVersion} to ${currentVersion + 1}`,
      );
      try {
        currentData = migration(currentData);
      } catch (error) {
        console.error(`Migration failed at version ${currentVersion}`, error);
        throw new Error(
          `Falha na migração dos dados da versão ${currentVersion}`,
        );
      }
    } else {
      console.warn(`No migration found for version ${currentVersion}`);
    }
    currentVersion++;
  }

  return currentData;
}
