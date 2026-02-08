// Define the shape of the persisted data for each version
// We use 'any' here because old versions might not match current types
export type MigrationFunction = (data: any) => any;

export const CURRENT_DATA_VERSION = 1;

export const MIGRATIONS: Record<number, MigrationFunction> = {
  // Example migration:
  // 1: (data) => {
  //   return { ...data, newField: 'default' };
  // },
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
