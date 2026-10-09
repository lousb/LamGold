import { urlForImage } from "../sanity/utils";

/** A picture field as returned by the queries (Sanity image + alt) */
export type Picture = {
  _key?: string;
  asset?: { _ref?: string } | null;
  crop?: unknown;
  hotspot?: unknown;
  alt?: string | null;
};

/** Shape returned by `productCardFields` in data/sanity/queries.ts */
export type ProductCard = {
  _id: string;
  type?: string | null;
  carats?: number | null;
  thickness?: string | null;
  length?: string | null;
  weight?: string | null;
  description?: string | null;
  createdAt?: string | null;
  title?: string | null;
  slug?: string | null;
  previewImageUrl?: string | null;
  price?: number | null;
  maxPrice?: number | null;
  images?: Picture[] | null;
  /** Dev-only placeholder products have no real images */
  placeholder?: boolean;
};

/**
 * The order product types appear in the numbered Index (and so in each
 * product's "01." number). Matches the Home design: chains, pendants,
 * bracelets, earrings.
 */
const TYPE_ORDER = [
  "necklaces",
  "chains",
  "pendants",
  "bracelets",
  "earrings",
  "rings",
];

export function sortForIndex<T extends ProductCard>(products: T[]): T[] {
  const typeRank = (type?: string | null) => {
    const i = TYPE_ORDER.indexOf(type ?? "");
    return i === -1 ? TYPE_ORDER.length : i;
  };
  return [...products].sort(
    (a, b) =>
      typeRank(a.type) - typeRank(b.type) ||
      (a.createdAt ?? "").localeCompare(b.createdAt ?? "") ||
      (a.title ?? "").localeCompare(b.title ?? ""),
  );
}

/** "01.", "02." ... */
export const formatIndexNumber = (index: number) =>
  `${String(index + 1).padStart(2, "0")}.`;

export const formatKarat = (carats?: number | null) =>
  carats ? `${carats}K` : "";

const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? String(amount) : amount.toFixed(2);

/** "AU$ 780" (product page buttons) */
export const formatPrice = (amount?: number | null) =>
  amount || amount === 0 ? `AU$ ${formatAmount(amount)}` : "";

/** "$780" (tile captions) */
export const formatShortPrice = (amount?: number | null) =>
  amount || amount === 0 ? `$${formatAmount(amount)}` : "";

/** The [karat, thickness, length, weight] spec row */
export const specRow = (product: ProductCard) => [
  formatKarat(product.carats),
  product.thickness ?? "",
  product.length ?? "",
  product.weight ?? "",
];

export type TileImage = { key: string; src: string; alt: string };

/**
 * Editorial images from Sanity, falling back to the Shopify preview image.
 * Returns plain URLs so client components don't need the image builder.
 */
export function productImages(
  product: ProductCard,
  width = 1300,
): TileImage[] {
  const images = (product.images ?? [])
    .map((image, i) => {
      const src = urlForImage(image)?.width(width).url();
      return src
        ? {
            key: image._key ?? String(i),
            src,
            alt: image.alt || product.title || "",
          }
        : null;
    })
    .filter((image): image is TileImage => !!image);

  if (!images.length && product.previewImageUrl) {
    images.push({
      key: "preview",
      src: product.previewImageUrl,
      alt: product.title ?? "",
    });
  }
  return images;
}

export function pictureUrls(
  pictures: Picture[] | null | undefined,
  width = 1300,
): TileImage[] {
  return (pictures ?? [])
    .map((image, i) => {
      const src = urlForImage(image)?.width(width).url();
      return src
        ? { key: image._key ?? String(i), src, alt: image.alt || "" }
        : null;
    })
    .filter((image): image is TileImage => !!image);
}

/**
 * Placeholder products from the Home design, used in development only
 * while the dataset is empty so the layout can be checked against the
 * designs with the grid overlay (Option+G).
 */
export const PLACEHOLDER_PRODUCTS: ProductCard[] = [
  ["chains", "Diamond Cut Curb Chain", 9, "1mm", "42cm", "1.4g"],
  ["chains", "Diamond Cut Curb Chain", 9, "2.1mm", "50cm", "1.4g"],
  ["chains", "Diamond Cut Figaro Chain (Super Slim)", 9, "1mm", "42cm", "1.4g"],
  ["chains", "Diamond Cut Figaro Chain (Slim)", 9, "2.1mm", "50cm", "1.4g"],
  ["chains", "Diamond Cut Figaro Chain (Regular)", 9, "3.3mm", "50cm", "1.4g"],
  ["chains", "Chopin Link Chain", 14, "0.85mm", "42cm", "1.4g"],
  ["chains", "Singapore Chain", 9, "1.8mm", "42cm", "1.4g"],
  ["chains", "Flat Herringbone Snake Chain", 14, "1.6mm", "42cm", "1.4g"],
  ["chains", "Box Chain", 9, "1.2mm", "42cm", "1.4g"],
  ["chains", "Flat Cable Link Chain", 14, "1mm", "42cm", "1.4g"],
  ["chains", "Curbed Anchor Chain", 9, "2.4mm", "42cm", "1.4g"],
  ["pendants", "Gothic Pendants", 9, "", "", "0.8g"],
  ["bracelets", "Figaro Chain Bracelet (Slim)", 9, "2.1mm", "16cm", "1.4g"],
  ["bracelets", "Figaro Chain Bracelet (Medium Slim)", 9, "2.8mm", "16cm", "1.4g"],
  ["bracelets", "Figaro Chain Bracelet (Regular)", 9, "3.3mm", "16cm", "1.4g"],
  ["bracelets", "Herringbone Chain Bracelet", 14, "1.5mm", "16cm", "1.4g"],
  ["bracelets", "Bevelled Curb Diamond Cut Bracelet", 9, "2.8mm", "16cm", "1.4g"],
  ["bracelets", "Bevelled Curb Diamond Cut Bracelet", 9, "4.1mm", "16cm", "1.4g"],
  ["earrings", "Thick Hoop (Small)", 14, "3mm", "16mm", "1.4g"],
  ["earrings", "Thick Hoop (Medium)", 14, "3mm", "22mm", "1.4g"],
  ["earrings", "Thin Hoop (Medium)", 14, "1.2mm", "30mm", "1.4g"],
  ["earrings", "Thin Hoop (Large)", 14, "1.2mm", "50mm", "1.4g"],
  ["earrings", "Huggie Hoop (Extra Small)", 14, "1.5mm", "10mm", "1.4g"],
  ["earrings", "Huggie Hoop (Small)", 14, "1.5mm", "12mm", "1.4g"],
  ["earrings", "Huggie Hoop (Medium)", 14, "1.5mm", "14mm", "1.4g"],
  ["earrings", "Huggie Hoop (Large)", 14, "1.5mm", "16mm", "1.4g"],
].map(([type, title, carats, thickness, length, weight], i) => ({
  _id: `placeholder-${i}`,
  type: type as string,
  title: title as string,
  carats: carats as number,
  thickness: thickness as string,
  length: length as string,
  weight: weight as string,
  price: 780,
  slug: `placeholder-${i}`,
  createdAt: String(i).padStart(3, "0"),
  placeholder: true,
}));
