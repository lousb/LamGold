import { Cart } from "../../shopify/types";

/** Shopify cart permalink: /cart/variantId:qty,variantId:qty */
export function checkoutUrl(cart: Cart) {
  const lines = cart.lines.map(
    (item) => item.merchandise.id.split("/").at(-1) + ":" + item.quantity,
  );
  return `${cart.checkoutUrl}${lines.join(",")}`;
}

export function redirectToCheckout(cart: Cart) {
  window.location.assign(checkoutUrl(cart));
}
