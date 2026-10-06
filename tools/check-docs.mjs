#!/usr/bin/env node
// Checks every relative link in the repository's Markdown files: the target
// file must exist, and a #anchor into a Markdown file must match one of its
// headings (GitHub's anchor rules). Anchors break silently when a heading is
// renamed, so run this after editing any doc:  npm run check:docs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['.git', 'node_modules']);

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(file);
    return entry.name.endsWith('.md') ? [file] : [];
  });
}

// Links inside fenced code blocks are examples, not links.
const withoutCode = (text) => text.replace(/^```[\s\S]*?^```/gm, '');

// GitHub's anchor for a heading: lower case, punctuation and symbols removed,
// spaces turned into hyphens. Letters and marks of any script (Thai) stay.
const slug = (heading) => heading.trim().toLowerCase()
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[\uFE00-\uFE0F]/g, '') // emoji variation selectors, which GitHub drops
  .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
  .replace(/ /g, '-');

const anchorCache = new Map();
function anchors(file) {
  if (!anchorCache.has(file)) {
    const found = new Set();
    const seen = new Map();
    for (const line of withoutCode(fs.readFileSync(file, 'utf8')).split('\n')) {
      const m = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
      if (!m) continue;
      const base = slug(m[1]);
      const n = seen.get(base) || 0;
      seen.set(base, n + 1);
      found.add(n ? `${base}-${n}` : base);
    }
    anchorCache.set(file, found);
  }
  return anchorCache.get(file);
}

const broken = [];
let checked = 0;
for (const file of markdownFiles(ROOT)) {
  const text = withoutCode(fs.readFileSync(file, 'utf8'));
  const targets = [
    ...[...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]),
    ...[...text.matchAll(/<img [^>]*src="([^"]+)"/g)].map((m) => m[1]),
  ];
  const rel = path.relative(ROOT, file);
  for (const target of targets) {
    if (/^(https?:|mailto:|tel:)/.test(target)) continue;
    checked++;
    const [filePart, hash] = target.split('#');
    const resolved = filePart ? path.resolve(path.dirname(file), decodeURI(filePart)) : file;
    if (!fs.existsSync(resolved)) {
      broken.push(`${rel}: no such file: ${target}`);
    } else if (hash && resolved.endsWith('.md') && !anchors(resolved).has(decodeURIComponent(hash))) {
      broken.push(`${rel}: no such heading: ${target}`);
    }
  }
}

for (const b of broken) console.error(`BROKEN  ${b}`);
console.log(`${checked} relative links checked, ${broken.length} broken`);
process.exit(broken.length ? 1 : 0);
