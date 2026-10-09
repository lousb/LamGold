import "../styles/globals.css";

import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Toaster } from "sonner";

import { DraftModeToast } from "./draft-mode-toast";

import { sanityFetch, SanityLive } from "../data/sanity";
import { HOME_QUERY, SETTINGS_QUERY } from "../data/sanity/queries";
import { resolveOpenGraphImage } from "../sanity/utils";
import { handleError } from "./client-utils";


import { GridOverlay } from "../components/grid-overlay";
import { Footer } from "../components/footer/footer";
import { Header } from "../components/header/header";
import { CartProvider } from "./_cart/cart-context";
import { CartProductInfo } from "./_cart/cart";
import { OverlayProvider } from "../components/overlays/overlay-context";
import { Overlays } from "../components/overlays/overlays";
import {
  formatKarat,
  PLACEHOLDER_PRODUCTS,
  ProductCard,
  productImages,
} from "../data/products";
import { INDEX_PRODUCTS_QUERY } from "../data/sanity/queries";

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const [{ data: settings }, { data: home }] = await Promise.all([
    sanityFetch({
      query: SETTINGS_QUERY,
      // Metadata should never contain stega
      stega: false,
    }),
    sanityFetch({
      query: HOME_QUERY,
      // Metadata should never contain stega
      stega: false,
    }),
  ]);
  const title = settings?.title || "LamGold";
  const description =
    home?.pageSeo?.description ||
    "LamGold - custom gold jewellery, made-to-order and ready-to-wear.";

  const ogImage = resolveOpenGraphImage(home?.pageSeo?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.metadataBase
      ? new URL(settings.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const [{ data: settings }, { data: products }] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY }),
    sanityFetch({ query: INDEX_PRODUCTS_QUERY }),
  ]);

  // Specs + images for the cart overlay, keyed by Shopify handle
  const cartProducts: Record<string, CartProductInfo> = {};
  const cartSource = (
    products?.length || process.env.NODE_ENV !== "development"
      ? (products ?? [])
      : PLACEHOLDER_PRODUCTS
  ) as ProductCard[];
  for (const product of cartSource) {
    if (!product.slug) continue;
    cartProducts[product.slug] = {
      title: product.title,
      karat: formatKarat(product.carats),
      details: [product.thickness ?? "", product.length ?? "", product.weight ?? ""],
      images: productImages(product, 200),
    };
  }

  return (
    <html lang="en">
      <body>
        {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
        <Toaster />
        {process.env.NODE_ENV === "development" && <GridOverlay />}
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
            <VisualEditing />
          </>
        )}
        {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
        <SanityLive onError={handleError} />
        {/* We'll keep a static store to demonstrate functionality. For a complete e-commerce solution, the cart should have server state in the form of cookies */}
        <CartProvider>
          <OverlayProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Overlays
              products={cartProducts}
              enquiryIntro={
                settings?.customEnquiryIntro as PortableTextBlock[] | undefined
              }
            />
          </OverlayProvider>
        </CartProvider>
      </body>
    </html>
  );
}
