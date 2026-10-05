import Link from "next/link";

import { LocalCart } from "../../app/_cart/local-cart";
import { sanityFetch } from "../../data/sanity";
import { SETTINGS_QUERY } from "../../data/sanity/queries";
import s from "./header.module.css";

/** Shown until Site Settings → Footer → Products is filled in */
const PLACEHOLDER_PRODUCT_TYPES = ["chains", "bracelets", "earrings", "pendants"];

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Header/Desktop: fixed black bar, 40px from the top and left,
 * 100vw - 80px wide, split into three equal sections.
 */
export async function Header() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY });

  // Same product types as the footer's Products column
  const productTypes = settings?.footer?.productTypes?.length
    ? settings.footer.productTypes
    : PLACEHOLDER_PRODUCT_TYPES;

  return (
    <header className={s.header}>
      <nav className={s.bar} aria-label="Main">
        <ul role="list" className={s.products}>
          {productTypes.map((type, i) => (
            <li key={type}>
              <Link href={`/products?type=${type}`}>
                {capitalise(type)}
                {i < productTypes.length - 1 ? "," : ""}
              </Link>
            </li>
          ))}
        </ul>

        <div className={s.section}>
          {/* TODO: point at the Custom Piece section / enquiry overlay */}
          <Link href="/#custom">Custom</Link>
        </div>

        <div className={`${s.section} ${s.split}`}>
          <Link href="/products">Index</Link>
          <LocalCart />
        </div>
      </nav>
    </header>
  );
}
