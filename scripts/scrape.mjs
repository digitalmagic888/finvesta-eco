import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import * as cheerio from "cheerio";

const routes = [
  "/",
  "/arbitrage",
  "/braindsandbonds",
  "/company",
  "/ecointent",
  "/whitepaper",
  "/product",
  "/legal",
  "/systemloops",
];

const site = "https://www.finvesta.eco";
const outDir = path.join(process.cwd(), "scraped");
const assetDir = path.join(process.cwd(), "public", "assets");

await mkdir(outDir, { recursive: true });
await mkdir(assetDir, { recursive: true });

function slugFor(route) {
  return route === "/" ? "home" : route.slice(1);
}

function cleanText(value = "") {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function absoluteUrl(value) {
  if (!value) return null;
  try {
    return new URL(value, site).toString();
  } catch {
    return null;
  }
}

function wixOriginal(src) {
  if (!src) return null;
  const match = src.match(/https:\/\/static\.wixstatic\.com\/media\/([^/?#]+)/);
  return match ? `https://static.wixstatic.com/media/${match[1]}` : src;
}

async function downloadAsset(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset ${url} returned ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const type = response.headers.get("content-type") || "";
  const ext =
    type.includes("png") ? ".png" :
    type.includes("jpeg") || type.includes("jpg") ? ".jpg" :
    type.includes("webp") ? ".webp" :
    type.includes("svg") ? ".svg" :
    path.extname(new URL(url).pathname).split("/").pop() || ".bin";
  const name = `${createHash("sha1").update(url).digest("hex").slice(0, 12)}${ext}`;
  await writeFile(path.join(assetDir, name), buffer);
  return `/assets/${name}`;
}

const allAssets = new Map();
const pages = [];

for (const route of routes) {
  const url = `${site}${route === "/" ? "" : route}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);

  const meta = {
    title: cleanText($("title").first().text()),
    description: $("meta[name='description']").attr("content") || "",
    ogTitle: $("meta[property='og:title']").attr("content") || "",
    ogDescription: $("meta[property='og:description']").attr("content") || "",
    ogImage: $("meta[property='og:image']").attr("content") || "",
    canonical: $("link[rel='canonical']").attr("href") || url,
  };

  const favicon = $("link[rel='icon']").attr("href") || "";
  if (favicon) allAssets.set(favicon, favicon);
  if (meta.ogImage) allAssets.set(wixOriginal(meta.ogImage), meta.ogImage);

  const imageInfos = [];
  $("[data-image-info]").each((_, el) => {
    const raw = $(el).attr("data-image-info");
    try {
      const info = JSON.parse(raw);
      const data = info.imageData || {};
      if (data.uri) {
        const original = `https://static.wixstatic.com/media/${data.uri}`;
        allAssets.set(original, original);
        imageInfos.push({
          uri: data.uri,
          alt: data.alt || data.name || "",
          width: data.width,
          height: data.height,
          original,
        });
      }
    } catch {}
  });

  $("img").each((_, el) => {
    const src = absoluteUrl($(el).attr("src"));
    if (src && src.includes("static.wixstatic.com")) allAssets.set(wixOriginal(src), src);
  });

  const links = [];
  $("a").each((_, el) => {
    const text = cleanText($(el).text());
    const href = absoluteUrl($(el).attr("href"));
    if (text && href) links.push({ text, href });
  });

  const textBlocks = [];
  $("h1,h2,h3,h4,h5,h6,p,li,a,span").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const text = cleanText($(el).text());
    if (!text || text === "top of page" || text === "bottom of page") return;
    const prev = textBlocks[textBlocks.length - 1];
    if (prev?.text === text) return;
    textBlocks.push({ tag, text });
  });

  const page = {
    route,
    slug: slugFor(route),
    url,
    meta,
    favicon,
    links,
    imageInfos,
    textBlocks,
  };
  pages.push(page);
  await writeFile(path.join(outDir, `${page.slug}.html`), html);
}

const assetMap = {};
for (const [original] of allAssets) {
  if (!original) continue;
  try {
    assetMap[original] = await downloadAsset(original);
  } catch (error) {
    console.warn(`Failed asset ${original}: ${error.message}`);
  }
}

await writeFile(path.join(outDir, "pages.json"), JSON.stringify({ pages, assetMap }, null, 2));
console.log(`Scraped ${pages.length} pages and ${Object.keys(assetMap).length} assets.`);
