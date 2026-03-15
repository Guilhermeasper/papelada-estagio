
import test from "node:test";
import assert from "node:assert";
import { validateDate } from "./dateCalculator";

test("validateDate", async (t) => {
  await t.test("should return error for empty date", () => {
    const result = validateDate("");
    assert.deepStrictEqual(result, { isValid: false, error: "Data não informada" });
  });

  await t.test("should return error for invalid date string", () => {
    const result = validateDate("invalid-date");
    assert.deepStrictEqual(result, { isValid: false, error: "Data inválida" });
  });

  await t.test("should return error for Saturday", () => {
    const result = validateDate("2025-01-04");
    assert.deepStrictEqual(result, { isValid: false, error: "Data inválida: Sábado é fim de semana" });
  });

  await t.test("should return error for Sunday", () => {
    const result = validateDate("2025-01-05");
    assert.deepStrictEqual(result, { isValid: false, error: "Data inválida: Domingo é fim de semana" });
  });

  await t.test("should return error for fixed holiday (Confraternização Universal)", () => {
    const result = validateDate("2025-01-01");
    assert.deepStrictEqual(result, { isValid: false, error: "Data inválida: Confraternização Universal" });
  });

  await t.test("should return error for movable holiday (Sexta-feira Santa 2025)", () => {
    const result = validateDate("2025-04-18");
    assert.deepStrictEqual(result, { isValid: false, error: "Data inválida: Sexta-feira Santa" });
  });

  await t.test("should return valid for a regular workday", () => {
    const result = validateDate("2025-01-06"); // Monday
    assert.strictEqual(result.isValid, true);
    assert.ok(result.date instanceof Date);
    assert.strictEqual(result.date.toISOString().startsWith("2025-01-06"), true);
  });
});
