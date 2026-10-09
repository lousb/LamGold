"use client";

import NextImage from "next/image";
import { useState } from "react";

import { TileImage } from "../../data/products";
import s from "./gallery.module.css";

/**
 * Main image with a row of thumbnails (hover or tap to swap).
 * Product page: thumbnails 60 x 80, 40px from the top on desktop.
 * Mobile (product + custom piece): 36 x 48, centred on the image.
 * The custom piece image shows no thumbnails on desktop.
 */
export function Gallery({
  images,
  variant = "product",
  placeholderThumbnails = 0,
  priority = false,
}: {
  images: TileImage[];
  variant?: "product" | "custom";
  placeholderThumbnails?: number;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const thumbs: TileImage[] = images.length
    ? images
    : Array.from({ length: placeholderThumbnails }, (_, i) => ({
        key: String(i),
        src: "",
        alt: "",
      }));

  return (
    <div className={`${s.gallery} ${s[variant]}`}>
      {current ? (
        <NextImage
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 767px) 100vw, 33vw"
          className={s.image}
          priority={priority}
        />
      ) : null}

      {thumbs.length > 1 ? (
        <ul className={s.thumbnails} role="list">
          {thumbs.map((image, i) => (
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
    </div>
  );
}
