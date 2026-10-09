import Image from "next/image";
import Link from "next/link";

import { sanityFetch } from "../../data/sanity";
import { SETTINGS_QUERY } from "../../data/sanity/queries";
import { urlForImage } from "../../sanity/utils";
import SanityLink from "../sanity-link";
import { Wordmark } from "../wordmark/wordmark";
import { FooterNewsletter } from "./footer-newsletter";
import s from "./footer.module.css";

/**
 * Placeholder content from the Footer/Desktop design, shown until the
 * matching fields are filled in under Site Settings → Footer in Sanity.
 */
const PLACEHOLDER_PRODUCT_TYPES = ["chains", "bracelets", "earrings", "pendants"];
const PLACEHOLDER_INFO_LINKS = [
  { label: "Karat Guide", url: "/karat-guide" },
  { label: "Necklace Size Guide", url: "/necklace-size-guide" },
  { label: "Shipping and Returns", url: "/shipping-and-returns" },
  { label: "Contact Us", url: "/contact" },
  { label: "Terms & Conditions", url: "/terms-and-conditions" },
  { label: "Privacy Policy", url: "/privacy-policy" },
];
const PLACEHOLDER_CONNECT_LINKS = [
  { label: "Instagram", url: "#" },
  { label: "Tik Tok", url: "#" },
  { label: "Are.na", url: "#" },
];

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export async function Footer() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY });
  const footer = settings?.footer;
  const footerImage = urlForImage(settings?.footerImage)?.width(800).url();

  const productTypes = footer?.productTypes?.length
    ? footer.productTypes
    : PLACEHOLDER_PRODUCT_TYPES;
  const infoLinks = footer?.infoLinks?.length ? footer.infoLinks : null;
  const connectLinks = footer?.connectLinks?.length
    ? footer.connectLinks
    : null;

  return (
    <footer className={`grid ${s.footer}`}>
      <nav className={`span-8 ${s.column}`} aria-label="Products">
        <h2 className={s.heading}>Products</h2>
        <ul role="list">
          {productTypes.map((type) => (
            <li key={type}>
              <Link href={`/products?type=${type}`}>{capitalise(type)}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={`span-4 ${s.column}`} aria-label="Information">
        <h2 className={s.heading}>Information</h2>
        <ul role="list">
          {infoLinks
            ? infoLinks.map((link) => (
                <li key={link._key}>
                  <SanityLink link={link} showExternalArrow={false}>
                    {link.label}
                  </SanityLink>
                </li>
              ))
            : PLACEHOLDER_INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.url}>{link.label}</Link>
                </li>
              ))}
        </ul>
      </nav>

      <nav className={`span-4 ${s.column}`} aria-label="Connect">
        <h2 className={s.heading}>Connect</h2>
        <ul role="list">
          {connectLinks
            ? connectLinks.map((link) => (
                <li key={link._key}>
                  <SanityLink link={link} showExternalArrow={false}>
                    {link.label}
                  </SanityLink>
                </li>
              ))
            : PLACEHOLDER_CONNECT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.url}>{link.label}</a>
                </li>
              ))}
        </ul>
      </nav>

      <section className={`span-8 ${s.column}`} aria-label="Newsletter">
        <h2 className={s.heading}>Newsletter</h2>
        <FooterNewsletter />
      </section>

      {/* Site Settings → Footer image (grey placeholder until it's set) */}
      <div className={`span-full ${s.imageRow}`}>
        <div className={s.image}>
          {footerImage ? (
            <Image
              src={footerImage}
              alt={settings?.footerImage?.alt ?? ""}
              fill
              sizes="(max-width: 767px) 50vw, 20vw"
            />
          ) : null}
        </div>
      </div>

      <div className={`span-full ${s.logo}`}>
        <Wordmark />
      </div>
    </footer>
  );
}
