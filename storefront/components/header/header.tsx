import Link from "next/link";

import { LocalCart } from "../../app/_cart/local-cart";
import { sanityFetch } from "../../data/sanity";
import { SETTINGS_QUERY } from "../../data/sanity/queries";
import { OverlayTrigger } from "../overlays/overlay-context";
import { BackLink } from "./back-link";
import s from "./header.module.css";

/** Shown until Site Settings → Footer → Products is filled in */
const PLACEHOLDER_PRODUCT_TYPES = ["chains", "bracelets", "earrings", "pendants"];

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Desktop (Home design): fixed bar 20px from the top/left, 100vw - 40px wide,
 * product types / Custom / Index + Cart.
 * Mobile: just "Cart (0)" top right, plus "Back" on every page but Home.
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
        <ul role="list" className={`${s.products} ${s.desktop}`}>
          {productTypes.map((type, i) => (
            <li key={type}>
              <Link href={`/products?type=${type}`}>
                {capitalise(type)}
                {i < productTypes.length - 1 ? "," : ""}
              </Link>
            </li>
          ))}
        </ul>

        <div className={`${s.section} ${s.desktop}`}>
          <OverlayTrigger name="enquiry">Custom</OverlayTrigger>
        </div>

        <BackLink className={s.back} />

        <div className={`${s.section} ${s.split}`}>
          <Link href="/#index" className={s.desktop}>
            Index
          </Link>
          <LocalCart />
        </div>
      </nav>
    </header>
  );
}
