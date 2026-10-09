"use client";

import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";

import {
  formatKarat,
  formatShortPrice,
  ProductCard,
  productImages,
} from "../../data/products";
import s from "./product-tile.module.css";

/**
 * Product Thumbnail Link (Product Card (PLP) design).
 * Desktop: image only; on hover the thumbnails and caption appear and
 * hovering a thumbnail swaps the main image. Mobile: always shown.
 */
export function ProductTile({
  product,
  priority = false,
}: {
  product: ProductCard;
  priority?: boolean;
}) {
  const images = productImages(product);
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  const href = product.slug ? `/products/${product.slug}` : "#";
  const details = [product.thickness, product.length, product.weight].filter(
    Boolean,
  );

  return (
    <article className={s.tile}>
      <NextLink href={href} className={s.link} aria-label={product.title ?? ""}>
        {current ? (
          <NextImage
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 767px) 100vw, 33vw"
            className={s.image}
            priority={priority}
          />
        ) : (
          <span className={s.placeholder} />
        )}

        <span className={s.caption}>
          {product.title}
          {product.price || product.price === 0
            ? `, ${formatShortPrice(product.price)},`
            : ","}
          <br />
          Gold{product.carats ? `, ${formatKarat(product.carats)},` : ","}
          <br />
          {details.join(", ")}
        </span>
      </NextLink>

      {images.length > 1 || product.placeholder ? (
        <ul className={s.thumbnails} role="list">
          {(product.placeholder
            ? [0, 1, 2].map((i) => ({ key: String(i), src: "", alt: "" }))
            : images
          ).map((image, i) => (
            <li key={image.key}>
              <button
                type="button"
                className={s.thumbnail}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={i === active}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                {image.src ? (
                  <NextImage src={image.src} alt="" fill sizes="60px" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
