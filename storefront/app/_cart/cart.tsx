"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useOverlay } from "../../components/overlays/overlay-context";
import panel from "../../components/overlays/panel.module.css";
import { CartItem } from "../../shopify/types";
import { redirectToCheckout } from "./cart-actions";
import { useCart } from "./cart-context";
import s from "./cart.module.css";

/** What the cart needs to know about each product, keyed by Shopify handle */
export type CartProductInfo = {
  title?: string | null;
  karat?: string;
  details?: string[];
  images: { key: string; src: string; alt: string }[];
};

const formatAmount = (amount: string | number) => {
  const n = Number(amount);
  return `AU$ ${Number.isInteger(n) ? n : n.toFixed(2)}`;
};

/** "Thick Hoop (Small)" -> ["Thick Hoop", "Small"] */
const splitTitle = (title: string) => {
  const match = title.match(/^(.*?)\s*\((.+)\)\s*$/);
  return match ? [match[1], match[2]] : [title, null];
};

/** "Cart (n)" in the header - opens the cart panel */
export function CartToggle() {
  const { cart } = useCart();
  const { openOverlay } = useOverlay();

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => openOverlay("cart")}
    >
      Cart ({cart?.totalQuantity ?? 0})
    </button>
  );
}

/** Cart overlay contents */
export function CartItems({
  products,
}: {
  products: Record<string, CartProductInfo>;
}) {
  const { cart, updateCartItem } = useCart();
  const { closeOverlay } = useOverlay();
  const lines = cart?.lines ?? [];

  if (!lines.length) {
    return <p className={s.empty}>Your cart is empty.</p>;
  }

  return (
    <ul role="list" className={s.items}>
      {lines.map((item) => (
        <CartLine
          key={item.merchandise.id}
          item={item}
          info={products[item.merchandise.product.handle]}
          onRemove={() => updateCartItem(item.merchandise.id, "delete")}
          onNavigate={closeOverlay}
        />
      ))}
    </ul>
  );
}

function CartLine({
  item,
  info,
  onRemove,
  onNavigate,
}: {
  item: CartItem;
  info?: CartProductInfo;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  const { merchandise } = item;
  const fallback = merchandise.variantImage ?? merchandise.product.featuredImage;
  const images = info?.images.length
    ? info.images
    : fallback
      ? [{ key: fallback.url, src: fallback.url, alt: fallback.altText ?? "" }]
      : [];
  const [name, variant] = splitTitle(info?.title || merchandise.product.title);
  const href = `/products/${merchandise.product.handle}`;
  const karat = info?.karat;
  const details = info?.details?.filter(Boolean) ?? [];
  const price = formatAmount(item.cost.totalAmount.amount);
  const [currency, amount] = price.split(" ");

  return (
    <li className={s.item}>
      <h3 className={s.title}>
        <Link href={href} onClick={onNavigate}>
          {variant ? (
            <>
              {name},<span className={s.variant}> {variant}</span>
            </>
          ) : (
            name
          )}
        </Link>
        {item.quantity > 1 ? ` × ${item.quantity}` : null}
      </h3>

      <button type="button" className={s.remove} onClick={onRemove}>
        Remove
      </button>

      <ul role="list" className={s.thumbnails}>
        {images.length ? (
          images.map((image) => (
            <li key={image.key} className={s.thumbnail}>
              <NextImage src={image.src} alt="" fill sizes="60px" />
            </li>
          ))
        ) : (
          <li className={s.thumbnail} />
        )}
      </ul>

      {/* Desktop: "Gold, 9K," / "1mm, 42cm, 1.4g". Mobile: one value per column */}
      <p className={s.details}>
        <span className={s.material}>Gold,</span>{" "}
        {karat ? <span className={s.karat}>{karat},</span> : null}
        <br className={s.desktopBreak} />
        {details.map((value, i) => (
          <span key={i} className={s[`detail${i}`]}>
            {value}
            {i < details.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      <p className={s.price}>
        <span className={s.currency}>{currency}</span>{" "}
        <span className={s.amount}>{amount}</span>
      </p>
    </li>
  );
}

/** Mobile note + "Continue To Checkout ... AU$ 2340" bar */
export function CartFooter() {
  const { cart } = useCart();
  const [pending, setPending] = useState(false);
  const empty = !cart?.lines.length;
  // Demo lines (presentation mode, before Shopify) can't go to checkout
  const demo = !!cart?.lines.some((line) =>
    line.merchandise.id.startsWith("demo-"),
  );

  return (
    <>
      <p className={s.note}>Shipping &amp; taxes calculated at checkout.</p>
      <button
        type="button"
        className={panel.bar}
        disabled={empty || pending || demo}
        title={demo ? "Checkout opens once the store is connected" : undefined}
        onClick={() => {
          if (!cart) return;
          setPending(true);
          redirectToCheckout(cart);
        }}
      >
        <span>{pending ? "Redirecting…" : "Continue To Checkout"}</span>
        <span>{formatAmount(cart?.cost.totalAmount.amount ?? 0)}</span>
      </button>
    </>
  );
}
