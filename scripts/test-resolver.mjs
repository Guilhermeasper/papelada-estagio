// Lets `node --test` resolve what Vite resolves at build time: the
// @papelada-estagio/* alias, extensionless TypeScript imports and JSON imports
// without an attribute.
import { statSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const ALIAS = "@papelada-estagio/";
const SRC = new URL("../src/", import.meta.url);
const CANDIDATES = ["", ".ts", "/index.ts"];

function isFile(url) {
  return statSync(fileURLToPath(url), { throwIfNoEntry: false })?.isFile();
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith(".");
    if (!isRelative && !specifier.startsWith(ALIAS)) {
      return nextResolve(specifier, context);
    }

    const base = isRelative
      ? new URL(specifier, context.parentURL).href
      : new URL(specifier.slice(ALIAS.length), SRC).href;

    const match = CANDIDATES.map((suffix) => new URL(base + suffix)).find(
      isFile,
    );

    if (!match) return nextResolve(specifier, context);

    const resolved = nextResolve(match.href, context);
    return match.pathname.endsWith(".json")
      ? { ...resolved, importAttributes: { type: "json" } }
      : resolved;
  },
});
