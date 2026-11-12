#!/usr/bin/env node
// Makes small web copies of the publisher logos in src/assets/logo/ (originals are kept).
//
//   npm run resize:logos
//
// Each logo is scaled to fit within 240×80 px (never enlarged) and saved as WebP in
// src/assets/logo/web/, plus a manifest.json with each copy's file name and size so the
// cards can set width/height and avoid layout shift. Re-run after adding a logo.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src", "assets", "logo");
const OUT = path.join(SRC, "web");
const MAX_W = 240;
const MAX_H = 80; // logos display ~20px tall, so this keeps them sharp on high-density screens

fs.mkdirSync(OUT, { recursive: true });

const manifest = {};
for (const name of fs.readdirSync(SRC).sort()) {
  const file = path.join(SRC, name);
  if (!fs.statSync(file).isFile() || !/\.(png|jpe?g|webp)$/i.test(name)) continue;

  const outName = `${path.parse(name).name.replace(/[^A-Za-z0-9_-]+/g, "_")}.webp`;
  const { width, height, size } = await sharp(file)
    .resize({ width: MAX_W, height: MAX_H, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, outName));

  manifest[name] = { file: outName, width, height };
  console.log(`✔ ${name} → web/${outName} (${width}×${height}, ${(size / 1024).toFixed(1)} KB)`);
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${Object.keys(manifest).length} logos and web/manifest.json`);
