import { execFile } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import * as esbuild from "esbuild";

const execFileAsync = promisify(execFile);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".pdf-snapshots");
const buildDir = join(outDir, ".build");
const publicDir = join(root, "public");

async function bundleEntry() {
  const outfile = join(buildDir, "documents.entry.mjs");

  await esbuild.build({
    entryPoints: [join(root, "scripts/documents.entry.tsx")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node22",
    packages: "external",
    jsx: "automatic",
    logLevel: "warning",
    alias: { "@papelada-estagio": join(root, "src") },
    define: {
      "import.meta.env.BASE_URL": JSON.stringify(`${publicDir}/`),
      "import.meta.env.DEV": "false",
      "import.meta.env.PROD": "true",
    },
  });

  return outfile;
}

async function rasterize(pdfPath) {
  const base = pdfPath.replace(/\.pdf$/, "");
  await execFileAsync("pdftoppm", ["-r", "110", "-png", pdfPath, base]);
}

export async function renderSnapshots() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(buildDir, { recursive: true });

  const entry = await bundleEntry();
  const { renderAll } = await import(pathToFileURL(entry).href);
  const manifest = await renderAll(outDir);

  await Promise.all(manifest.map((doc) => rasterize(doc.file)));
  await rm(buildDir, { recursive: true, force: true });

  return manifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = await renderSnapshots();
  const pages = (await readdir(outDir)).filter((f) => f.endsWith(".png"));
  console.log(
    `Rendered ${manifest.length} documents (${pages.length} pages) into .pdf-snapshots/`,
  );
}
