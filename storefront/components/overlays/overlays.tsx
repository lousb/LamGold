"use client";

import dynamic from "next/dynamic";
import { PortableTextBlock } from "next-sanity";

import type { CartProductInfo } from "../../app/_cart/cart";
import { EnquiryForm, EnquirySubmit } from "./enquiry-form";
import { useOverlay } from "./overlay-context";
import { Panel } from "./panel";

// The cart lives in localStorage, so render it on the client only
const CartItems = dynamic(
  () => import("../../app/_cart/cart").then((m) => m.CartItems),
  { ssr: false },
);
const CartFooter = dynamic(
  () => import("../../app/_cart/cart").then((m) => m.CartFooter),
  { ssr: false },
);

/** Cart slides in from the right, Custom Enquiry from the left */
export function Overlays({
  products,
  enquiryIntro,
}: {
  products: Record<string, CartProductInfo>;
  enquiryIntro?: PortableTextBlock[] | null;
}) {
  const { open, closeOverlay } = useOverlay();

  return (
    <>
      <Panel
        side="right"
        label="Cart"
        open={open === "cart"}
        onClose={closeOverlay}
        footer={<CartFooter />}
      >
        <CartItems products={products} />
      </Panel>

      <Panel
        side="left"
        label="Custom enquiry"
        open={open === "enquiry"}
        onClose={closeOverlay}
        footer={<EnquirySubmit />}
      >
        <EnquiryForm intro={enquiryIntro} />
      </Panel>
    </>
  );
}
