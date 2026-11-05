import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getBackspacedMaskValue, maskCnpj } from "./masks.ts";

describe("maskCnpj", () => {
  it("formats a numeric CNPJ", () => {
    assert.equal(maskCnpj("11222333000181"), "11.222.333/0001-81");
  });

  it("keeps letters and uppercases them", () => {
    assert.equal(maskCnpj("12abc34501de35"), "12.ABC.345/01DE-35");
  });

  it("refuses letters in the check digits", () => {
    assert.equal(maskCnpj("12ABC34501DEX3"), "12.ABC.345/01DE-3");
  });
});

describe("getBackspacedMaskValue with an alphanumeric CNPJ", () => {
  it("removes the last character when a separator is deleted", () => {
    assert.equal(getBackspacedMaskValue("12.ABC", "12.ABC."), "12AB");
  });
});
