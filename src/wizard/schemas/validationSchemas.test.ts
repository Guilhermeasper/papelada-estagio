import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { CURRENT_DATA_VERSION, migrateData } from "../../utils/migrations.ts";
import { persistedStateSchema } from "./validationSchemas.ts";

interface ExampleFile {
  version: number;
  data: unknown;
}

function upgradeExample(name: string) {
  const url = new URL(`../../../examples/${name}`, import.meta.url);
  const example = JSON.parse(readFileSync(url, "utf8")) as ExampleFile;

  return {
    ...example,
    version: CURRENT_DATA_VERSION,
    data: migrateData(example.data, example.version),
  };
}

describe("persistedStateSchema", () => {
  it("imports the current example", () => {
    const result = persistedStateSchema.safeParse(
      upgradeExample("import-example.json"),
    );

    assert.equal(result.success, true);
  });

  it("imports the legacy example after the migrations", () => {
    const result = persistedStateSchema.safeParse(
      upgradeExample("import-example-v1-legacy.json"),
    );

    assert.equal(result.success, true);
  });

  it("refuses the invalid example", () => {
    const result = persistedStateSchema.safeParse(
      upgradeExample("import-example-invalid.json"),
    );

    assert.equal(result.success, false);
  });
});
