"use client";

import { buttonClassName } from "../../../components/ui/cta-button";
import { Product } from "../../../shopify/types";
import { useOverlay } from "../../../components/overlays/overlay-context";
import { useCart } from "../../_cart/cart-context";

/**
 * "Add To Cart ... AU$ 780" bar. Adds the first available variant (the
 * design has no option picker) and slides the cart in. Disabled until the
 * Shopify product loads.
 */
export function CartButton({
  product,
  price,
  className = "",
}: {
  product: Product | null;
  price: string;
  className?: string;
}) {
  const { addCartItem } = useCart();
  const { openOverlay } = useOverlay();
  const variant =
    product?.variants.find((v) => v.availableForSale) ?? product?.variants[0];
  const available = !!product?.availableForSale && !!variant;

  return (
    <button
      type="button"
      className={`${buttonClassName} ${className}`}
      disabled={!available}
      onClick={() => {
        if (product && variant) {
          addCartItem(variant, product);
          openOverlay("cart");
        }
      }}
    >
      <span>{product && !product.availableForSale ? "Out Of Stock" : "Add To Cart"}</span>
      <span>{price}</span>
    </button>
  );
}
