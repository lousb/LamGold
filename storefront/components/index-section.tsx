"use client";

import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";

import {
  formatIndexNumber,
  ProductCard,
  productImages,
  specRow,
} from "../data/products";
import s from "./index-section.module.css";

/**
 * Numbered index of every product (Home, after the last section).
 * Desktop: names top-left, the hovered product's image in the middle and
 * its spec row highlighted bottom-right; the rest are dimmed.
 * Mobile: every name with its spec row underneath, the first product's
 * image after the first entry.
 */
export function IndexSection({ products }: { products: ProductCard[] }) {
  const [active, setActive] = useState(0);
  if (!products.length) return null;

  const activeProduct = products[active] ?? products[0];
  const image = productImages(activeProduct)[0];
  const firstImage = productImages(products[0])[0];
  const href = (p: ProductCard) => (p.slug ? `/products/${p.slug}` : "#");

  return (
    <section id="index" className={`grid ${s.index}`} aria-label="Index">
      <ol className={s.names} role="list">
        {products.map((product, i) => {
          const [karat, thickness, length, weight] = specRow(product);
          return (
            <li
              key={product._id}
              className={i === active ? s.active : undefined}
              onMouseEnter={() => setActive(i)}
            >
              <NextLink
                href={href(product)}
                className={s.entry}
                onFocus={() => setActive(i)}
              >
                <span className={s.name}>
                  <span className={s.number}>{formatIndexNumber(i)}</span>
                  <span>{product.title}</span>
                </span>
                <span className={s.mobileSpecs}>
                  <span>{karat}</span>
                  <span>{thickness}</span>
                  <span>{length}</span>
                  <span>{weight}</span>
                </span>
              </NextLink>
              {i === 0 ? (
                <div className={`${s.image} ${s.mobileImage}`}>
                  {firstImage ? (
                    <NextImage
                      src={firstImage.src}
                      alt={firstImage.alt}
                      fill
                      sizes="100vw"
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className={`${s.image} ${s.desktopImage}`}>
        {image ? (
          <NextImage src={image.src} alt={image.alt} fill sizes="33vw" />
        ) : null}
      </div>

      <ol className={s.specs} role="list" aria-hidden>
        {products.map((product, i) => (
          <li
            key={product._id}
            className={i === active ? s.active : undefined}
            onMouseEnter={() => setActive(i)}
          >
            <NextLink href={href(product)} tabIndex={-1} className={s.specRow}>
              {specRow(product).map((value, j) => (
                <span key={j}>{value}</span>
              ))}
            </NextLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
