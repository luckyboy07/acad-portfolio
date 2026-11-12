#!/usr/bin/env node
// Imports papers from the filled-in spreadsheet template into the site.
//
//   npm run import:papers -- <papers.csv> [pdf-folder] [--dry-run]
//
// - <papers.csv>  the "Papers" sheet of templates/papers-template.xlsx, saved as "CSV UTF-8".
// - [pdf-folder]  folder containing the PDF / .bib files named in the sheet.
// - --dry-run     validate and print a summary without writing anything.
//
// The sheet is the source of truth: src/data/papers.json is replaced with its rows,
// and referenced files are copied to public/papers/ under a consistent name
// (<year>-<title-slug>.pdf). Nothing is written if any row has an error.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = path.join(ROOT, "src", "data", "papers.json");
const OUT_FILES = path.join(ROOT, "public", "papers");
const PUBLIC_PREFIX = "/papers/";

const REQUIRED = ["title", "authors", "year", "venue", "description"];
const OPTIONAL = ["url", "pdf", "doi", "code", "bibtex", "show"];
const COLUMNS = [...REQUIRED, ...OPTIONAL];

const WARN_MB = 10;
const MAX_MB = 95; // GitHub rejects files over 100 MB

// ---------- CLI ----------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const [csvPath, fileDir] = args.filter((a) => !a.startsWith("--"));

if (!csvPath) {
  console.error("Usage: npm run import:papers -- <papers.csv> [pdf-folder] [--dry-run]");
  process.exit(1);
}
if (/\.xlsx?$/i.test(csvPath)) {
  console.error(
    "This is an Excel file. Open it and save the \"Papers\" sheet as CSV first:\n" +
      "  Excel:          File → Save As → \"CSV UTF-8 (Comma delimited) (*.csv)\"\n" +
      "  Google Sheets:  File → Download → Comma-separated values (.csv)",
  );
  process.exit(1);
}
if (!fs.existsSync(csvPath)) fail(`CSV file not found: ${csvPath}`);
if (fileDir && !fs.statSync(fileDir, { throwIfNoEntry: false })?.isDirectory()) {
  fail(`PDF folder not found: ${fileDir}`);
}

// ---------- CSV parsing (RFC 4180: quoted fields, "" escapes, newlines in quotes) ----------

function parseCsv(text) {
  text = text.replace(/^﻿/, "");
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  // Some Excel locales export with semicolons.
  const delim = !firstLine.includes(",") && firstLine.includes(";") ? ";" : ",";

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------- Helpers ----------

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

const clean = (s = "") => s.replace(/\s+/g, " ").trim();
const isUrl = (s) => /^https?:\/\/\S+$/i.test(s);
const normTitle = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

function slugify(s, max = 60) {
  const slug = s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  // Cut long titles at a word boundary.
  const short = slug.length > max ? slug.slice(0, max).replace(/-[^-]*$/, "") : slug;
  return short || "paper";
}

function parseShow(value) {
  const v = value.toLowerCase();
  if (v === "" || ["true", "yes", "y", "1"].includes(v)) return true;
  if (["false", "no", "n", "0"].includes(v)) return false;
  return null;
}

function normalizeDoi(value) {
  const doi = value.replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, "").trim();
  return /^10\.\d{4,9}\/\S+$/.test(doi) ? doi : null;
}

// Case-insensitive lookup of a file name in the source folder ("paper" also matches "paper.pdf").
let folderListing;
function findFile(name, ext) {
  folderListing ??= fs.readdirSync(fileDir);
  const wanted = [name, `${name}${ext}`].map((n) => n.toLowerCase());
  const match = folderListing.find((f) => wanted.includes(f.toLowerCase()));
  return match ? path.join(fileDir, match) : null;
}

// ---------- Validate rows ----------

const text = fs.readFileSync(csvPath, "utf8");
if (text.includes("�")) {
  fail(
    "The CSV isn't UTF-8, so accented characters (ñ, é, …) would be corrupted.\n" +
      '  Re-save it from Excel as "CSV UTF-8 (Comma delimited)", or download it from Google Sheets.',
  );
}

const [headerRow, ...dataRows] = parseCsv(text);
if (!headerRow) fail("The CSV is empty.");

const headers = headerRow.map((h) => h.trim().toLowerCase());
const unknown = headers.filter((h) => h && !COLUMNS.includes(h));
const missing = REQUIRED.filter((h) => !headers.includes(h));
if (unknown.length || missing.length) {
  fail(
    [
      missing.length && `Missing required column(s): ${missing.join(", ")}`,
      unknown.length && `Unknown column(s): ${unknown.join(", ")} (check spelling)`,
      `Expected columns: ${COLUMNS.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n  "),
  );
}

const errors = [];
const warnings = [];
const papers = [];
const copies = []; // { from, to }
const seenTitles = new Map();
const seenDois = new Map();
const usedIds = new Set();
const currentYear = new Date().getFullYear();

dataRows.forEach((cells, index) => {
  const rowNum = index + 2; // spreadsheet row number (row 1 is the header)
  const raw = Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? "").trim()]));
  if (Object.values(raw).every((v) => v === "")) return; // blank row

  const rowErrors = [];
  const err = (msg) => rowErrors.push(`Row ${rowNum}: ${msg}`);
  const warn = (msg) => warnings.push(`Row ${rowNum}: ${msg}`);

  for (const col of REQUIRED) if (!raw[col]) err(`"${col}" is required`);

  const title = clean(raw.title);
  const year = Number(raw.year);
  if (raw.year && !(/^\d{4}$/.test(raw.year) && year >= 1950 && year <= currentYear + 1)) {
    err(`"year" must be a 4-digit year between 1950 and ${currentYear + 1} (got "${raw.year}")`);
  }

  if (title) {
    const key = normTitle(title);
    if (seenTitles.has(key)) err(`duplicate title (same as row ${seenTitles.get(key)})`);
    else seenTitles.set(key, rowNum);
  }

  const paper = {
    title,
    authors: clean(raw.authors),
    year,
    venue: clean(raw.venue),
    description: clean(raw.description),
  };

  for (const col of ["url", "code"]) {
    if (!raw[col]) continue;
    if (isUrl(raw[col])) paper[col] = raw[col];
    else err(`"${col}" must be a full link starting with https:// (got "${raw[col]}")`);
  }

  if (raw.doi) {
    const doi = normalizeDoi(raw.doi);
    if (!doi) err(`"doi" doesn't look like a DOI, expected e.g. 10.18653/v1/2024.acl-long.1 (got "${raw.doi}")`);
    else if (seenDois.has(doi.toLowerCase())) err(`duplicate DOI (same as row ${seenDois.get(doi.toLowerCase())})`);
    else {
      seenDois.set(doi.toLowerCase(), rowNum);
      paper.doi = doi;
    }
  }

  // id doubles as the base name for copied files, so it must be unique.
  let id = `${raw.year}-${slugify(title)}`;
  for (let n = 2; usedIds.has(id); n++) id = `${raw.year}-${slugify(title)}-${n}`;

  // pdf / bibtex: either a link, or a file name in the PDF folder.
  for (const [col, ext] of [["pdf", ".pdf"], ["bibtex", ".bib"]]) {
    const value = raw[col];
    if (!value) continue;
    if (isUrl(value)) {
      if (/drive\.google\.com|docs\.google\.com/i.test(value)) {
        warn(`"${col}" is a Google Drive link; make sure sharing is set to "Anyone with the link"`);
      }
      paper[col] = value;
      continue;
    }
    if (!fileDir) {
      err(`"${col}" names a file ("${value}") but no PDF folder was given on the command line`);
      continue;
    }
    const source = findFile(value, ext);
    if (!source) {
      err(`"${col}" file not found in ${fileDir}: "${value}"`);
      continue;
    }
    if (path.extname(source).toLowerCase() !== ext) {
      err(`"${col}" must be a ${ext} file (got "${path.basename(source)}")`);
      continue;
    }
    const sizeMb = fs.statSync(source).size / 1024 / 1024;
    if (ext === ".pdf") {
      const fd = fs.openSync(source, "r");
      const magic = Buffer.alloc(5);
      fs.readSync(fd, magic, 0, 5, 0);
      fs.closeSync(fd);
      if (magic.toString("latin1") !== "%PDF-") {
        err(`"${path.basename(source)}" is not a valid PDF (it may be a renamed Word file)`);
        continue;
      }
    }
    if (sizeMb > MAX_MB) {
      err(`"${path.basename(source)}" is ${sizeMb.toFixed(0)} MB; files must be under ${MAX_MB} MB. Compress it first.`);
      continue;
    }
    if (sizeMb > WARN_MB) {
      warn(`"${path.basename(source)}" is ${sizeMb.toFixed(1)} MB; consider compressing it (most papers are < 5 MB)`);
    }
    const target = `${id}${ext}`;
    copies.push({ from: source, to: path.join(OUT_FILES, target) });
    paper[col] = PUBLIC_PREFIX + target;
  }

  const show = parseShow(raw.show ?? "");
  if (show === null) err(`"show" must be TRUE or FALSE (got "${raw.show}")`);
  if (show === false) paper.hidden = true;

  if (rowErrors.length) {
    errors.push(...rowErrors);
    return;
  }
  usedIds.add(id);
  papers.push({ id, ...paper });
});

// ---------- Report ----------

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  ${w}`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} error(s), nothing was imported:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
if (papers.length === 0) fail("No papers found in the CSV.");

papers.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

const previous = fs.existsSync(OUT_JSON) ? JSON.parse(fs.readFileSync(OUT_JSON, "utf8")) : [];
const referenced = new Set(copies.map((c) => path.basename(c.to)));
const orphans = fs.existsSync(OUT_FILES) ? fs.readdirSync(OUT_FILES).filter((f) => !referenced.has(f)) : [];
const hiddenCount = papers.filter((p) => p.hidden).length;

console.log(`\n✔ ${papers.length} paper(s) valid${hiddenCount ? ` (${hiddenCount} hidden)` : ""}, ${copies.length} file(s) to copy.`);
console.log(`  papers.json: ${previous.length} → ${papers.length} entries`);
if (orphans.length) {
  console.log(`  Files in public/papers/ no longer referenced (not deleted; remove them if unwanted):`);
  for (const o of orphans) console.log(`    ${o}`);
}

if (dryRun) {
  console.log("\nDry run: nothing written.");
  process.exit(0);
}

fs.mkdirSync(OUT_FILES, { recursive: true });
for (const { from, to } of copies) fs.copyFileSync(from, to);
fs.writeFileSync(OUT_JSON, JSON.stringify(papers, null, 2) + "\n");

console.log(`\nWrote ${path.relative(ROOT, OUT_JSON)} and copied files to ${path.relative(ROOT, OUT_FILES)}/.`);
console.log("Next: run `npm run dev` to check the Papers page, then commit and push to deploy.");
