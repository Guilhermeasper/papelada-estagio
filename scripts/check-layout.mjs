import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".pdf-snapshots");

/**
 * Max dead space allowed between the last line of a page and the content bottom.
 * Sized to the tallest indivisible unit we render — a table row, which is kept
 * atomic so it never tears across a page break.
 */
const MAX_TRAILING_GAP = 80;
/**
 * A larger gap is legitimate when the next page opens on a heading: PDFSection's
 * `minPresenceAhead` deliberately breaks early rather than strand a heading.
 */
const MAX_HEADING_GAP = 110;
/** Two text lines closer than this on both axes are drawing on top of each other. */
const MIN_OVERLAP = 2;
/** A page carrying less content than this is a stray page, not a page. */
const MIN_PAGE_CONTENT = 100;

const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/(\w+)="([-\d.]+)"/g)].map(([, k, v]) => [k, Number(v)]),
  );

const words = (xml) =>
  [...xml.matchAll(/<word[^>]*>([\s\S]*?)<\/word>/g)]
    .map(([, word]) => word)
    .join(" ");

async function readPages(pdf) {
  const { stdout } = await execFileAsync("pdftotext", [
    "-bbox-layout",
    pdf,
    "-",
  ]);

  return [...stdout.matchAll(/<page ([^>]*)>([\s\S]*?)<\/page>/g)].map(
    ([, pageAttrs, body]) => ({
      ...attrs(pageAttrs),
      lines: [...body.matchAll(/<line ([^>]*)>([\s\S]*?)<\/line>/g)].map(
        ([, lineAttrs, lineBody]) => ({
          ...attrs(lineAttrs),
          text: words(lineBody),
        }),
      ),
      blocks: [...body.matchAll(/<block ([^>]*)>([\s\S]*?)<\/block>/g)].map(
        ([, blockAttrs, blockBody]) => ({
          ...attrs(blockAttrs),
          text: words(blockBody),
        }),
      ),
    }),
  );
}

function startsAHeading(text, headings) {
  return headings.find((heading) => text.startsWith(heading));
}

function checkPage(page, pageNumber, nextPage, doc) {
  const problems = [];
  const isLastPage = nextPage === undefined;
  const { lines } = page;
  if (lines.length === 0) return problems;

  const contentBottom = page.height - doc.paddingBottom;
  const lastLine = lines.reduce((a, b) => (a.yMax > b.yMax ? a : b));
  const gap = contentBottom - lastLine.yMax;

  const nextOpensOnHeading =
    nextPage?.blocks.length &&
    startsAHeading(
      nextPage.blocks.reduce((a, b) => (a.yMin < b.yMin ? a : b)).text,
      doc.headings,
    );
  const allowed = nextOpensOnHeading ? MAX_HEADING_GAP : MAX_TRAILING_GAP;

  if (!isLastPage && !doc.coverPages.includes(pageNumber) && gap > allowed) {
    problems.push(
      `page ${pageNumber}: ${gap.toFixed(0)}pt of trailing whitespace (max ${allowed}pt) after "${lastLine.text.slice(0, 50)}"`,
    );
  }

  const contentTop = lines.reduce((a, b) => (a.yMin < b.yMin ? a : b)).yMin;
  const contentHeight = lastLine.yMax - contentTop;

  if (
    !doc.coverPages.includes(pageNumber) &&
    contentHeight < MIN_PAGE_CONTENT
  ) {
    problems.push(
      `page ${pageNumber}: stray page — only ${contentHeight.toFixed(0)}pt of content ("${lastLine.text.slice(0, 40)}")`,
    );
  }

  const lastBlock = page.blocks.reduce((a, b) => (a.yMax > b.yMax ? a : b));
  const orphan = startsAHeading(lastBlock.text, doc.headings);

  if (!isLastPage && orphan) {
    problems.push(
      `page ${pageNumber}: orphan heading at page bottom — "${orphan.slice(0, 50)}"`,
    );
  }

  for (let i = 0; i < lines.length; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      const a = lines[i];
      const b = lines[j];
      const vertical = Math.min(a.yMax, b.yMax) - Math.max(a.yMin, b.yMin);
      const horizontal = Math.min(a.xMax, b.xMax) - Math.max(a.xMin, b.xMin);

      if (vertical > MIN_OVERLAP && horizontal > MIN_OVERLAP) {
        problems.push(
          `page ${pageNumber}: overlapping text (${vertical.toFixed(1)}pt) — "${a.text.slice(0, 34)}" / "${b.text.slice(0, 34)}"`,
        );
      }
    }
  }

  return problems;
}

async function checkDocument(doc) {
  const pages = await readPages(doc.file);

  return pages.flatMap((page, index) =>
    checkPage(page, index + 1, pages[index + 1], doc),
  );
}

export async function checkLayout() {
  const manifest = JSON.parse(
    await readFile(join(outDir, "manifest.json"), "utf8"),
  );

  const results = [];
  for (const doc of manifest) {
    const pages = await readPages(doc.file);
    results.push({
      name: doc.name,
      pageCount: pages.length,
      problems: await checkDocument(doc),
    });
  }

  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = await checkLayout();
  let failed = 0;

  for (const { name, pageCount, problems } of results) {
    const status = problems.length === 0 ? "ok" : `${problems.length} problems`;
    console.log(`\n${name} — ${pageCount} pages — ${status}`);
    for (const problem of problems) console.log(`  ${problem}`);
    failed += problems.length;
  }

  console.log(`\n${failed} problems total`);
  process.exit(failed === 0 ? 0 : 1);
}
