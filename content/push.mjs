#!/usr/bin/env node
/**
 * Push content/lamgold-content.xlsx (and content/images) to Sanity.
 *
 *   npm run content:push                  write everything
 *   npm run content:push -- --dry-run     check the sheet, print a summary
 *   npm run content:push -- --remove-dummy  delete the products this sheet made
 *
 * Needs SANITY_API_WRITE_TOKEN (Editor) in storefront/.env.local or the
 * environment. Project + dataset come from the same file.
 */
import { createClient } from "@sanity/client";
import ExcelJS from "exceljs";
import { createHash } from "node:crypto";
import { createReadStream, existsSync, readFileSync, writeSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const REMOVE = args.has("--remove-dummy");

const PRODUCT_TYPES = ["chains", "pendants", "bracelets", "earrings", "necklaces", "rings"];
const PRODUCT_PREFIX = "dummy-product-";

// ---------------------------------------------------------------- env

function loadEnv(file) {
  if (!existsSync(file)) return {};
  const env = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...loadEnv(join(root, "storefront/.env.local")), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;

if (!projectId) fail("NEXT_PUBLIC_SANITY_PROJECT_ID is missing from storefront/.env.local");
if (!DRY && !token) {
  fail(
    "SANITY_API_WRITE_TOKEN is missing.\n" +
      "Create an Editor token at sanity.io/manage → API → Tokens and add it to storefront/.env.local",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-28",
  useCdn: false,
});

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------- sheet helpers

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(join(here, "lamgold-content.xlsx"));

const text = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    if (value.richText) return value.richText.map((t) => t.text).join("");
    if (value.text) return String(value.text);
    if (value.result != null) return String(value.result);
    if (value instanceof Date) return value.toISOString().slice(0, 10);
  }
  return String(value).trim();
};

const sheet = (name) => {
  const ws = workbook.getWorksheet(name);
  if (!ws) fail(`The sheet has no "${name}" tab`);
  return ws;
};

/** Header row → array of row objects */
function rows(name) {
  const ws = sheet(name);
  const headers = ws.getRow(1).values.slice(1).map(text);
  const out = [];
  ws.eachRow((row, i) => {
    if (i === 1) return;
    const obj = {};
    headers.forEach((h, c) => (obj[h] = text(row.getCell(c + 1).value)));
    if (Object.values(obj).some(Boolean)) out.push({ ...obj, _row: i });
  });
  return out;
}

/** Field | Value tab → object */
function fields(name) {
  const obj = {};
  for (const row of rows(name)) obj[row.Field] = row.Value;
  return obj;
}

const list = (value) =>
  text(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const key = (...parts) =>
  createHash("md5").update(parts.join("|")).digest("hex").slice(0, 12);

/** Plain text → Portable Text (blank line = new paragraph) */
const blocks = (value) =>
  text(value)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => ({
      _type: "block",
      _key: key("b", i, p),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key("s", i, p), text: p, marks: [] }],
    }));

const errors = [];
const check = (ok, message) => {
  if (!ok) errors.push(message);
};

// ---------------------------------------------------------------- images

const imageCache = new Map();

function imagePath(name) {
  const file = name.match(/\.(jpe?g|png|webp)$/i) ? name : `${name}.jpg`;
  return join(here, "images", file);
}

async function picture(name, alt = "") {
  const path = imagePath(name);
  if (!existsSync(path)) {
    errors.push(`Image not found: content/images/${name}`);
    return null;
  }
  if (DRY) {
    // Same id shape Sanity gives an upload: image-<sha1>-<w>x<h>-<ext>
    const sha1 = createHash("sha1").update(readFileSync(path)).digest("hex");
    return { _type: "picture", asset: { _type: "reference", _ref: `image-${sha1}-1600x2400-jpg` }, alt };
  }
  if (!imageCache.has(path)) {
    // Sanity de-duplicates identical files, so re-pushing doesn't add copies
    const asset = await client.assets.upload("image", createReadStream(path), {
      filename: path.split("/").pop(),
    });
    imageCache.set(path, asset._id);
    process.stdout.write(".");
  }
  return {
    _type: "picture",
    asset: { _type: "reference", _ref: imageCache.get(path) },
    alt,
  };
}

async function pictures(value, alt = "") {
  const out = [];
  for (const name of list(value)) {
    const pic = await picture(name, alt);
    if (pic) out.push({ ...pic, _key: key("img", name) });
  }
  return out;
}

// ---------------------------------------------------------------- remove

if (REMOVE) {
  const ids = await client.fetch(`*[_id match $p]._id`, { p: `${PRODUCT_PREFIX}*` });
  if (!ids.length) {
    console.log("No dummy products to remove.");
    process.exit(0);
  }
  // Home's sections reference products by query, but the custom piece
  // section references them directly - clear those first.
  const tx = client.transaction();
  tx.patch("home", (p) =>
    p.unset(['pageBuilder[_type=="customPieceSection"].products']),
  );
  ids.forEach((id) => tx.delete(id));
  await tx.commit();
  console.log(`Removed ${ids.length} dummy products.`);
  process.exit(0);
}

// ---------------------------------------------------------------- products

const productRows = rows("Products");
const productId = (slug) => `${PRODUCT_PREFIX}${slug}`;
const slugs = new Set();
const products = [];
const start = Date.UTC(2026, 0, 1);

for (const [i, row] of productRows.entries()) {
  const where = `Products row ${row._row}`;
  const slug = row.Slug;
  check(slug && /^[a-z0-9-]+$/.test(slug), `${where}: Slug should be lowercase letters, numbers and hyphens`);
  check(!slugs.has(slug), `${where}: Slug "${slug}" is used twice`);
  slugs.add(slug);
  check(row.Title, `${where}: Title is empty`);
  check(PRODUCT_TYPES.includes(row.Type), `${where}: Type must be one of ${PRODUCT_TYPES.join(", ")}`);
  const price = Number(String(row["Price (AUD)"]).replace(/[^0-9.]/g, ""));
  check(price > 0, `${where}: Price (AUD) should be a number`);
  const carats = parseInt(row.Karat, 10);

  products.push({
    _id: productId(slug),
    _type: "product",
    type: row.Type,
    description: row.Description || undefined,
    materialsAndSpecifications: blocks(row["Materials + Specifications"]),
    carats: Number.isFinite(carats) ? carats : undefined,
    thickness: row.Thickness || undefined,
    length: row.Length || undefined,
    weight: row.Weight || undefined,
    images: await pictures(row.Images, row.Title),
    // Stand-in for the Shopify sync until the store is connected
    store: {
      title: row.Title,
      slug: { _type: "slug", current: slug },
      // Sheet order = Index order within a type
      createdAt: new Date(start + i * 60_000).toISOString(),
      status: "active",
      isDeleted: false,
      priceRange: { minVariantPrice: price, maxVariantPrice: price },
    },
  });
}

// ---------------------------------------------------------------- home

const custom = fields("Custom Piece");
const story = fields("Story");
const homeRows = rows("Home").filter((r) => r.Section).sort((a, b) => Number(a.Order) - Number(b.Order));
const pageBuilder = [];

for (const row of homeRows) {
  const where = `Home row ${row._row}`;
  const section = row.Section.toLowerCase();
  if (section === "product type") {
    check(PRODUCT_TYPES.includes(row["Product type"]), `${where}: Product type must be one of ${PRODUCT_TYPES.join(", ")}`);
    pageBuilder.push({
      _type: "productTypeSection",
      _key: key("home", row.Order, row["Product type"]),
      heading: row.Heading || undefined,
      productType: row["Product type"],
    });
  } else if (section === "custom piece") {
    const refs = list(custom["Example products"]);
    refs.forEach((s) => check(slugs.has(s), `Custom Piece: example product "${s}" isn't on the Products tab`));
    pageBuilder.push({
      _type: "customPieceSection",
      _key: key("home", row.Order, "custom"),
      heading: row.Heading || undefined,
      products: refs.slice(0, 3).map((s) => ({
        _type: "reference",
        _key: key("ref", s),
        _ref: productId(s),
      })),
      description: custom.Description || undefined,
      images: await pictures(custom.Images, "Custom piece"),
      karats: list(custom.Karats),
      thicknesses: list(custom.Thicknesses),
      lengths: list(custom.Lengths),
      weights: list(custom.Weights),
      materialsAndSpecifications: blocks(custom["Materials + Specifications"]),
      priceLabel: custom["Price label"] || undefined,
      buttonLabel: custom["Button label"] || undefined,
    });
  } else if (section === "story") {
    pageBuilder.push({
      _type: "storySection",
      _key: key("home", row.Order, "story"),
      heading: story.Heading || undefined,
      body: blocks(story.Body),
    });
  } else {
    errors.push(`${where}: Section must be Product type, Custom piece or Story`);
  }
}

const home = { _id: "home", _type: "home", pageBuilder };

// ---------------------------------------------------------------- info pages

const infoPages = [];
{
  let page, section, group;
  for (const row of rows("Information Pages")) {
    if (row["Page slug"]) {
      page = {
        _id: `infoPage-${row["Page slug"]}`,
        _type: "infoPage",
        title: row["Page title"],
        slug: { _type: "slug", current: row["Page slug"] },
        lastUpdated: row["Last updated"] ? row["Last updated"].slice(0, 10) : undefined,
        intro: row.Intro || undefined,
        sections: [],
      };
      check(page.title, `Information Pages row ${row._row}: Page title is empty`);
      infoPages.push(page);
      section = group = null;
    }
    if (!page) {
      errors.push(`Information Pages row ${row._row}: no Page slug above this row`);
      continue;
    }
    if (row.Section) {
      section = {
        _type: "infoSection",
        _key: key(page._id, page.sections.length, row.Section),
        title: row.Section,
        groups: [],
      };
      page.sections.push(section);
      group = null;
    }
    if (!section) continue;
    if (row["Group label"] || !group) {
      group = {
        _type: "infoGroup",
        _key: key(section._key, section.groups.length, row["Group label"]),
        label: row["Group label"] || undefined,
        items: [],
      };
      section.groups.push(group);
    }
    if (row["List item"]) group.items.push(row["List item"]);
  }
}
const infoSlugs = new Set(infoPages.map((p) => p.slug.current));

// ---------------------------------------------------------------- settings

const settingsFields = fields("Settings");
const footerLinks = rows("Footer Links");

const link = (row) => {
  const href = row.Link;
  const slug = href.replace(/^\//, "");
  const base = { _type: "link", _key: key("link", row.Column, row.Label), label: row.Label, openInNewTab: /^https?:/.test(href) };
  return href.startsWith("/") && infoSlugs.has(slug)
    ? { ...base, linkType: "page", page: { _type: "reference", _ref: `infoPage-${slug}`, _weak: true } }
    : { ...base, linkType: "href", href };
};

const footerImage = settingsFields["Footer image"]
  ? await picture(settingsFields["Footer image"], "LamGold")
  : null;

const settings = {
  _id: "settings",
  _type: "settings",
  title: settingsFields["Site title"] || "LamGold",
  metadataBase: settingsFields["Site URL"] || undefined,
  shippingReturnsWarranties: blocks(settingsFields["Shipping, Returns + Warranties"]),
  customEnquiryIntro: blocks(settingsFields["Custom enquiry intro"]),
  footer: {
    _type: "footer",
    productTypes: list(settingsFields["Footer products"]),
    infoLinks: footerLinks.filter((r) => r.Column === "Information").map(link),
    connectLinks: footerLinks.filter((r) => r.Column === "Connect").map(link),
  },
  ...(footerImage ? { footerImage } : {}),
};
list(settingsFields["Footer products"]).forEach((t) =>
  check(PRODUCT_TYPES.includes(t), `Settings: footer product "${t}" isn't a product type`),
);

// ---------------------------------------------------------------- guides

const karat = fields("Karat Guide");
const karatGuide = {
  _id: "karatGuide",
  _type: "karatGuide",
  heroImage: karat.Image ? (await picture(karat.Image, "Karat Guide")) ?? undefined : undefined,
  heroDescription: karat.Description || undefined,
  karatGuide: {
    karat24: karat["24K"] || undefined,
    karat18: karat["18K"] || undefined,
    karat14: karat["14K"] || undefined,
    karat9: karat["9K"] || undefined,
  },
};

const necklace = fields("Necklace Size Guide");
const cm = (label) => {
  const n = Number(necklace[label]);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};
const necklaceSizeGuide = {
  _id: "necklaceSizeGuide",
  _type: "necklaceSizeGuide",
  heroDescription: necklace.Description || undefined,
  steps: Object.keys(necklace)
    .filter((k) => /^Step \d+$/.test(k) && necklace[k])
    .sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)))
    .map((k) => necklace[k]),
  heroExcerpt: necklace.Note || undefined,
  sizes: {
    xs: cm("Extra Small (cm)"),
    s: cm("Small (cm)"),
    m: cm("Medium (cm)"),
    l: cm("Large (cm)"),
    xl: cm("Extra Large (cm)"),
  },
};

// ---------------------------------------------------------------- write

if (DRY) process.stdout.write("\n");
if (errors.length) {
  fail(`Fix these in the sheet first:\n  - ${errors.join("\n  - ")}`);
}

const docs = [home, settings, karatGuide, necklaceSizeGuide, ...infoPages, ...products];
// Drop undefined values so Sanity doesn't store nulls
const clean = (doc) => JSON.parse(JSON.stringify(doc));

console.log(
  `\n${products.length} products, ${pageBuilder.length} home sections, ${infoPages.length} information pages, settings, karat guide, necklace size guide`,
);

if (DRY) {
  console.log(`Dry run: nothing written to ${projectId}/${dataset}.\n`);
  if (args.has("--json")) writeSync(1, JSON.stringify(docs.map(clean), null, 2) + "\n");
  process.exit(0);
}

const tx = client.transaction();
docs.forEach((doc) => tx.createOrReplace(clean(doc)));
await tx.commit({ visibility: "async" });
console.log(`✓ Pushed to ${projectId}/${dataset}. The site picks it up within a few seconds.\n`);
