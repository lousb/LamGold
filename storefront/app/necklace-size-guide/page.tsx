import type { Metadata } from "next";

import s from "../../components/guides/guides.module.css";
import { NecklaceDiagram } from "../../components/guides/necklace-diagram";
import { Band } from "../../components/wordmark/wordmark";
import { sanityFetch } from "../../data/sanity";
import { NECKLACE_SIZE_GUIDE_QUERY } from "../../data/sanity/queries";

export const metadata: Metadata = { title: "Necklace Size Guide" };

const SIZES = [
  { key: "xs", name: "Extra Small" },
  { key: "s", name: "Small" },
  { key: "m", name: "Medium" },
  { key: "l", name: "Large" },
  { key: "xl", name: "Extra Large" },
] as const;

/** Used in development only, until the guide is filled in */
const PLACEHOLDER = {
  heroDescription:
    "To best select a necklace with your desired size, follow the below steps before comparing with the provided diagram and chart.",
  steps: [
    "Measure and cut a length of string or paper, ensuring you have some excess.",
    "Place it around your neck, adjusting until the desired length is achieved.",
    "Mark the string or paper at the point of overlap at the desired length.",
    "Lay the string or paper flat onto a table and measure the distance between the material’s start and the mark made to get an exact measurement for your desired length.",
  ],
  heroExcerpt:
    "As an approximation, Extra Small provides a choker fit for women and Small provides a choker fit for men.",
  sizes: { xs: 40, s: 45, m: 50, l: 55, xl: 60 },
};

/**
 * Necklace Size Guide (Desktop / Mobile designs): description, steps and
 * a note on the left, the necklace diagram in the middle, the size chart
 * (cm and inches) on the right.
 */
export default async function NecklaceSizeGuidePage() {
  const { data } = await sanityFetch({ query: NECKLACE_SIZE_GUIDE_QUERY });
  const guide =
    data?._id || process.env.NODE_ENV !== "development" ? data : PLACEHOLDER;

  const sizes = SIZES.map(({ key, name }) => {
    const cm = guide?.sizes?.[key];
    return { key, name, cm, inches: cm ? Math.round(cm / 2.54) : null };
  });
  const rows = sizes.filter((size) => size.cm);

  return (
    <div>
      <div className={`grid ${s.panels}`}>
        <div className={s.left}>
          <div className={s.intro}>
            <h1 className={s.title}>Necklace Size Guide</h1>
            {guide?.heroDescription ? (
              <p className={s.copy}>{guide.heroDescription}</p>
            ) : null}
            {guide?.steps?.length ? (
              <ol className={s.steps}>
                {guide.steps.map((step, i) => (
                  <li key={i}>
                    <span className={s.stepNumber}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            {guide?.heroExcerpt ? (
              <p className={s.excerpt}>{guide.heroExcerpt}</p>
            ) : null}
          </div>
        </div>

        <div className={s.center}>
          <NecklaceDiagram
            labels={sizes.map((size) => (size.cm ? `${size.cm}cm` : ""))}
          />
        </div>

        <div className={s.right}>
          <div className={`${s.table} ${s.sizeTable}`}>
            {rows.map((size) => (
              <div key={size.key} className={s.sizeRow}>
                <span className={s.sizeName}>{size.name}</span>
                <span className={s.sizeCm}>{size.cm}cm</span>
                <span className={s.sizeIn}>{size.inches}”</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid ${s.necklaceBand}`}>
        <Band />
      </div>
    </div>
  );
}
