import type { Metadata } from "next";
import NextImage from "next/image";

import s from "../../components/guides/guides.module.css";
import { Band } from "../../components/wordmark/wordmark";
import { sanityFetch } from "../../data/sanity";
import { KARAT_GUIDE_QUERY } from "../../data/sanity/queries";
import { urlForImage } from "../../sanity/utils";

export const metadata: Metadata = { title: "Karat Guide" };

const KARATS = [
  { key: "karat24", label: "24K" },
  { key: "karat18", label: "18K" },
  { key: "karat14", label: "14K" },
  { key: "karat9", label: "9K" },
] as const;

/** Used in development only, until the Karat Guide is filled in */
const PLACEHOLDER = {
  heroDescription:
    "All of LAMGOLD’s pieces are made from a range of genuine gold karats to provide unparalleled beauty and durability for daily wear. As part of this approach, LAMGOLD only uses full karat jewellery, never gold-plating. To best understand the strengths of each karat, consult the following information:",
  karatGuide: {
    karat24:
      "Containing 99.9% pure gold, 24 karat gold possesses a deep, rich colour that appears almost as an orange-yellow. Due to being comprised almost exclusively of pure gold it is very soft, deforming easily. For this reason it is rarely used for the construction of jewellery, and is instead predominately used for investment items.",
    karat18:
      "Containing 75% pure gold, 18 karat gold maintains a rich yellow appearance while becoming strong enough to be considered for use in fine jewellery through the introduction of other alloys.",
    karat14:
      "Containing 58.3% pure gold, 14 karat gold is much stronger than higher karat versions and highly resistant to scratching, making it the ideal choice for jewellery.",
    karat9:
      "Containing 37.5% pure gold, 9 karat gold provides the highest level of durability for gold available. For this reason it is favoured in the casting of staple jewellery pieces to increase each pieces lifetime significantly.",
  },
} as const;

/**
 * Karat Guide (Desktop / Mobile designs): title + description on the
 * left, image in the middle, a row per karat on the right.
 */
export default async function KaratGuidePage() {
  const { data } = await sanityFetch({ query: KARAT_GUIDE_QUERY });
  const guide =
    data?._id || process.env.NODE_ENV !== "development"
      ? data
      : { ...PLACEHOLDER, heroImage: null };

  const image = urlForImage(guide?.heroImage)?.width(1400).url();
  const rows = KARATS.map(({ key, label }) => ({
    label,
    text: guide?.karatGuide?.[key],
  })).filter((row) => row.text);

  return (
    <div>
      <div className={`grid ${s.panels}`}>
        <div className={s.left}>
          <div className={s.intro}>
            <h1 className={s.title}>Karat Guide</h1>
            {guide?.heroDescription ? (
              <p className={s.copy}>{guide.heroDescription}</p>
            ) : null}
          </div>
        </div>

        <div className={s.center}>
          <div className={s.image}>
            {image ? (
              <NextImage
                src={image}
                alt={guide?.heroImage?.alt ?? ""}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                priority
              />
            ) : null}
          </div>
        </div>

        <div className={s.right}>
          <div className={`${s.table} ${s.karatTable}`}>
            {rows.map((row) => (
              <div key={row.label} className={s.karatRow}>
                <span className={s.karatLabel}>{row.label}</span>
                <p className={s.karatText}>{row.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid ${s.karatBand}`}>
        <Band />
      </div>
    </div>
  );
}
