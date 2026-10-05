"use client";

import dynamic from "next/dynamic";
const Cart = dynamic(() => import("./cart").then((mod) => mod.Cart), {
  ssr: false,
  loading: () => <span>Cart (0)</span>,
});

export function LocalCart() {
  return <Cart />;
}
