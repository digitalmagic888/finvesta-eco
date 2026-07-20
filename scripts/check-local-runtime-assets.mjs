import { readFile } from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["app", "public", "next.config.mjs"];
const externalUrl = /(?:https?:)?\/\//gi;
const assetOrScriptContext = /(?:<script[^>]+src=|<img[^>]+src=|<source[^>]+srcset=|<image[^>]+href=|url\(|src:\s*["'`]|images:\s*\[|openGraph[\s\S]{0,200}images)/i;
const allowedExternalLinks = /(?:href=|metadataBase|canonical|mailto:|label:|className="primary")/i;
const findings = [];

function filesIn(entry) {
  const full = path.join(root, entry);
  if (statSync(full).isFile()) return [entry];
  const out = [];
  const stack = [entry];
  while (stack.length) {
    const rel = stack.pop();
    const abs = path.join(root, rel);
    for (const name of readdirSync(abs)) {
      if (name === "node_modules" || name === ".next") continue;
      const child = path.join(rel, name);
      const st = statSync(path.join(root, child));
      if (st.isDirectory()) stack.push(child);
      else out.push(child);
    }
  }
  return out;
}

for (const file of scanRoots.flatMap(filesIn)) {
  const text = await readFile(path.join(root, file), "utf8").catch(() => null);
  if (!text) continue;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!externalUrl.test(line)) return;
    externalUrl.lastIndex = 0;
    if (assetOrScriptContext.test(line) && !allowedExternalLinks.test(line)) {
      findings.push(`${file}:${index + 1}: ${line.trim().slice(0, 240)}`);
    }
  });
}

if (findings.length) {
  console.error("External runtime script/image references found:\n" + findings.join("\n"));
  process.exit(1);
}

console.log("No external runtime script or image references found in app/, public/, or next.config.mjs.");
