#!/usr/bin/env node
// Imports publications from src/data/papers.xlsx ("Publications" sheet) into
// src/data/publications.json, which the /publications pages render.
//
//   npm run import:publications [-- path/to/papers.xlsx] [--dry-run]
//
// Sheet layout: a section title row (e.g. "Journal Articles", "Book Chapters",
// "Conference Proceedings") followed by one row per publication with columns
//   A title | B venue "(year)" | C DOI | D serial code | E front cover link | F full paper link | G publisher
//   | H authors (optional, separated by ";" e.g. "Acut, D. P.; Garcia, M. B.")
// TODO(client): author list for every publication (fill column H, then run npm run import:publications).
// Cells containing "Unavailable" (or empty) are treated as missing.
// Reads the .xlsx directly (it's a zip of XML files), so no extra dependency is needed.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_XLSX = path.join(ROOT, "src", "data", "papers.xlsx");
const OUT_JSON = path.join(ROOT, "src", "data", "publications.json");
const SHEET_NAME = "Publications";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const xlsxPath = args.find((a) => !a.startsWith("--")) ?? DEFAULT_XLSX;

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

if (!fs.existsSync(xlsxPath)) fail(`File not found: ${xlsxPath}`);

// ---------- Minimal zip reader ----------

function readZip(buf) {
  // End of central directory record: signature 0x06054b50, searched from the end.
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) fail("Not a valid .xlsx file (zip directory not found). Is the file still open/locked in Excel?");

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) fail("Corrupt .xlsx (bad central directory).");
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;

    const localNameLen = buf.readUInt16LE(localOffset + 26);
    const localExtraLen = buf.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLen + localExtraLen;
    const data = buf.subarray(start, start + compSize);
    files.set(name, () => (method === 0 ? data : zlib.inflateRawSync(data)).toString("utf8"));
  }
  return (name) => files.get(name)?.() ?? null;
}

// ---------- XML helpers ----------

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&");

// Concatenates all <t> runs (handles rich text), ignoring phonetic hints.
const textOf = (xml) =>
  decode(
    [...xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, "").matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""),
  );

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

// ---------- Read the sheet ----------

const read = readZip(fs.readFileSync(xlsxPath));

const workbook = read("xl/workbook.xml") ?? fail("Missing xl/workbook.xml");
const rels = read("xl/_rels/workbook.xml.rels") ?? fail("Missing workbook relationships");
const sheetTag = [...workbook.matchAll(/<sheet\b[^>]*>/g)].map((m) => m[0]).find((t) => attr(t, "name") === SHEET_NAME);
if (!sheetTag) fail(`No sheet named "${SHEET_NAME}" in ${path.basename(xlsxPath)}`);
const relId = attr(sheetTag, "r:id");
const relTag = [...rels.matchAll(/<Relationship\b[^>]*>/g)].map((m) => m[0]).find((t) => attr(t, "Id") === relId);
const target = attr(relTag ?? "", "Target") ?? fail("Sheet relationship not found");
const sheetPath = target.startsWith("/") ? target.slice(1) : `xl/${target}`;

const shared = [...(read("xl/sharedStrings.xml") ?? "").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));
const sheet = read(sheetPath) ?? fail(`Missing ${sheetPath}`);

const rows = [];
for (const [, rowAttrs, body] of sheet.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
  const cells = {};
  for (const [, cellAttrs, inner = ""] of body.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const col = attr(cellAttrs, "r").replace(/\d+/g, "");
    const type = attr(cellAttrs, "t");
    const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    let value;
    if (type === "s") value = shared[Number(v)];
    else if (type === "inlineStr") value = textOf(inner);
    else value = v === undefined ? "" : decode(v);
    cells[col] = (value ?? "").replace(/\s+/g, " ").trim();
  }
  rows.push({ num: Number(attr(rowAttrs, "r")), cells });
}

// ---------- Convert ----------

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const missing = (s) => !s || /^(unavailable|n\/?a|none|-)$/i.test(s);
const link = (s) => (missing(s) ? null : s.replace(/^http:\/\//i, "https://"));

function normalizeDoi(value) {
  if (missing(value)) return null;
  const doi = value.replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, "").trim();
  return /^10\.\d{4,9}\/\S+$/.test(doi) ? doi : undefined;
}

const errors = [];
const warnings = [];
const categories = [];
let current = null;

for (const { num, cells } of rows) {
  const {
    A: title = "",
    B: venueRaw = "",
    C: doiRaw = "",
    D: code = "",
    E: cover = "",
    F: pdf = "",
    G: publisher = "",
    H: authorsRaw = "",
  } = cells;
  if (!title && !venueRaw) continue;

  // Section title row: column A only (the first one also carries column headings like "DOI").
  if (title && !venueRaw) {
    current = { id: slugify(title), label: title, items: [] };
    categories.push(current);
    continue;
  }
  if (!current) {
    errors.push(`Row ${num}: publication appears before any section title row`);
    continue;
  }

  const yearMatch = venueRaw.match(/\((\d{4})\)\s*$/);
  if (!yearMatch) warnings.push(`Row ${num}: no "(year)" at the end of the venue "${venueRaw}"`);
  const year = yearMatch ? Number(yearMatch[1]) : null;
  const venue = venueRaw.replace(/\s*\(\d{4}\)\s*$/, "");

  const doi = normalizeDoi(doiRaw);
  if (doi === undefined) errors.push(`Row ${num}: "${doiRaw}" doesn't look like a DOI`);

  current.items.push({
    id: missing(code) ? `${current.id}-${num}` : code,
    // A trailing "(2026)" in the title duplicates the year, so it's dropped.
    title: title.replace(/\s*\(\d{4}\)\s*$/, ""),
    venue,
    year,
    // Empty until the sheet has an authors column; the site hides the author line when empty.
    authors: missing(authorsRaw)
      ? []
      : authorsRaw
          .split(";")
          .map((a) => a.trim())
          .filter(Boolean),
    publisher: missing(publisher) ? null : publisher,
    doi: doi ?? null,
    cover: link(cover),
    pdf: link(pdf),
  });
}

if (warnings.length) {
  console.warn(`⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  ${w}`);
}
if (errors.length) {
  console.error(`✖ ${errors.length} error(s), nothing written:`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
if (categories.length === 0) fail("No sections found in the sheet.");

for (const c of categories) {
  c.items.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  console.log(`✔ ${c.label}: ${c.items.length}`);
}

if (dryRun) {
  console.log("Dry run: nothing written.");
} else {
  fs.writeFileSync(OUT_JSON, JSON.stringify(categories, null, 2) + "\n");
  console.log(`Wrote ${path.relative(ROOT, OUT_JSON)}`);
}
