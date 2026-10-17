#!/usr/bin/env node
// Regenerates the inlined FastGit landing page inside both worker entry files.
//
// Both workers are deployed as a single pasted file ("粘贴 worker-*.js 的全部内容"),
// so the landing page (fastgit/index.html + styles.css + app.js) has to be embedded.
// Run this after editing anything under fastgit/:
//
//   node tools/embed-fastgit.mjs
//
// It only rewrites the block between the <fastgit-assets> markers; the rest of
// each worker is left untouched.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = "// <fastgit-assets>";
const END = "// </fastgit-assets>";
const SOURCES = [
  ["FASTGIT_INDEX_HTML", "fastgit/index.html"],
  ["FASTGIT_STYLES_CSS", "fastgit/styles.css"],
  ["FASTGIT_APP_JS", "fastgit/app.js"],
];
const TARGETS = ["worker-cloudflare.js", "worker-esa.js"];

// JSON.stringify gives a safe JavaScript string literal regardless of what the
// source contains (backticks, ${...}, quotes, newlines). Escape U+2028/2029,
// which are valid JSON but were historically invalid inside JS string literals.
const toLiteral = (value) =>
  JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const lines = [`${START} (generated from fastgit/ by tools/embed-fastgit.mjs — do not edit by hand)`];
for (const [name, file] of SOURCES) {
  const content = await readFile(path.join(root, file), "utf8");
  lines.push(`const ${name} = ${toLiteral(content)};`);
}
lines.push(END);
const block = lines.join("\n");

for (const target of TARGETS) {
  const file = path.join(root, target);
  const source = await readFile(file, "utf8");
  const startIndex = source.indexOf(START);
  const endIndex = source.indexOf(END, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`<fastgit-assets> markers not found in ${target}`);
  }
  const updated = source.slice(0, startIndex) + block + source.slice(endIndex + END.length);
  await writeFile(file, updated);
  console.log(`embedded fastgit assets into ${target}`);
}
