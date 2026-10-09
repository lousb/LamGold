"use client";

import dynamic from "next/dynamic";

// Cart lives in localStorage, so the count renders on the client only
const CartToggle = dynamic(
  () => import("./cart").then((mod) => mod.CartToggle),
  {
    ssr: false,
    loading: () => <span>Cart (0)</span>,
  },
);

export function LocalCart() {
  return <CartToggle />;
}
