"use client";

import { useOverlay } from "../../../components/overlays/overlay-context";
import { buttonClassName } from "../../../components/ui/cta-button";
import { Product, ProductVariant } from "../../../shopify/types";
import { useCart } from "../../_cart/cart-context";

/** Sanity data used for a demo cart line when Shopify isn't connected */
export type DemoCartProduct = {
  handle: string;
  title: string;
  price: number;
  image?: string;
};

function demoProduct(demo: DemoCartProduct): {
  product: Product;
  variant: ProductVariant;
} {
  const image = {
    url: demo.image ?? "",
    altText: demo.title,
    width: 1667,
    height: 2500,
  };
  const variant = {
    id: `demo-${demo.handle}`,
    title: "Default Title",
    availableForSale: true,
    selectedOptions: [],
    price: { amount: String(demo.price), currencyCode: "AUD" },
    image,
  } as unknown as ProductVariant;
  const product = {
    id: `demo-${demo.handle}`,
    handle: demo.handle,
    title: demo.title,
    availableForSale: true,
    featuredImage: image,
    variants: [variant],
  } as unknown as Product;
  return { product, variant };
}

/**
 * "Add To Cart ... AU$ 780" bar. Adds the first available variant (the
 * design has no option picker) and slides the cart in. Disabled until the
 * Shopify product loads. Without Shopify, `demo` adds a fake line instead.
 */
export function CartButton({
  product,
  demo,
  price,
  className = "",
}: {
  product: Product | null;
  demo?: DemoCartProduct | null;
  price: string;
  className?: string;
}) {
  const { addCartItem } = useCart();
  const { openOverlay } = useOverlay();

  const source =
    product ?? (demo ? demoProduct(demo).product : null);
  const variant =
    source?.variants.find((v) => v.availableForSale) ?? source?.variants[0];
  const available = !!source?.availableForSale && !!variant;

  return (
    <button
      type="button"
      className={`${buttonClassName} ${className}`}
      disabled={!available}
      onClick={() => {
        if (source && variant) {
          addCartItem(variant, source);
          openOverlay("cart");
        }
      }}
    >
      <span>
        {source && !source.availableForSale ? "Out Of Stock" : "Add To Cart"}
      </span>
      <span>{price}</span>
    </button>
  );
}
