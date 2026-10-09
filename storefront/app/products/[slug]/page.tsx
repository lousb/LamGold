import type { Metadata, ResolvingMetadata } from "next";
import { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import { CustomPortableText } from "../../../components/custom-portable-text";
import { Gallery } from "../../../components/gallery/gallery";
import { Accordion } from "../../../components/ui/accordion";
import { SpecColumns } from "../../../components/ui/spec-columns";
import { Band } from "../../../components/wordmark/wordmark";
import {
  formatIndexNumber,
  formatPrice,
  PLACEHOLDER_PRODUCTS,
  ProductCard,
  productImages,
  sortForIndex,
  specRow,
} from "../../../data/products";
import { sanityFetch } from "../../../data/sanity";
import {
  ALL_PRODUCT_PAGES_SLUGS,
  INDEX_PRODUCTS_QUERY,
  PRODUCT_METADATA_QUERY,
  PRODUCT_QUERY,
} from "../../../data/sanity/queries";
import { getProduct } from "../../../data/shopify";
import { resolveOpenGraphImage } from "../../../sanity/utils";
import { Product } from "../../../shopify/types";
import { CartButton } from "./cart-button";
import s from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

type ProductPageData = ProductCard & {
  materialsAndSpecifications?: PortableTextBlock[] | null;
  shippingReturnsWarranty?: PortableTextBlock[] | null;
};

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: ALL_PRODUCT_PAGES_SLUGS,
    perspective: "published",
    stega: false,
  });
  return data ?? [];
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: product } = await sanityFetch({
    query: PRODUCT_METADATA_QUERY,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(product?.store?.previewImageUrl);

  return {
    title: product?.store?.title,
    description: product?.store?.descriptionHtml,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

/**
 * Individual Product Page (Chain / Earring / Bracelet designs).
 *
 * Desktop (1920 x 1080): three 8-column panels -
 *   left: number, title and description centred, Add To Cart at the bottom
 *   centre: main image with thumbnails
 *   right: spec row centred, accordions + Add To Cart at the bottom
 * then the LAMGOLD band.
 *
 * Mobile (360 x 800): Back / Cart, number + title, image centred, spec row
 * and a full-width Add To Cart filling the first screen; description and
 * accordions below.
 */
export default async function Page(props: Props) {
  const params = await props.params;

  const [{ tags, data }, { data: indexProducts }] = await Promise.all([
    sanityFetch({ query: PRODUCT_QUERY, params }),
    sanityFetch({ query: INDEX_PRODUCTS_QUERY }),
  ]);

  let productPage = data as ProductPageData | null;
  let index = (indexProducts ?? []) as ProductCard[];

  // Development only: the Home placeholders link to /products/placeholder-n
  if (
    !productPage &&
    process.env.NODE_ENV === "development" &&
    params.slug.startsWith("placeholder-")
  ) {
    productPage =
      PLACEHOLDER_PRODUCTS.find((p) => p.slug === params.slug) ?? null;
    if (productPage) {
      productPage = { ...productPage, description: PLACEHOLDER_DESCRIPTION };
      index = PLACEHOLDER_PRODUCTS;
    }
  }

  if (!productPage) {
    return notFound();
  }

  // Shopify supplies the variants for the cart. Keep the page up if the
  // Storefront API isn't reachable (e.g. token not set yet).
  let shopifyProduct: Product | null = null;
  if (!productPage.placeholder) {
    try {
      shopifyProduct =
        (await getProduct({ handle: params.slug, tags })) ?? null;
    } catch (error) {
      console.error("Shopify product fetch failed", error);
    }
  }

  const position = sortForIndex(index).findIndex(
    (p) => p._id === productPage._id,
  );
  const number = formatIndexNumber(position === -1 ? 0 : position);
  const price = formatPrice(
    productPage.price ??
      (shopifyProduct
        ? Number(shopifyProduct.priceRange.minVariantPrice.amount)
        : null),
  );
  const images = productImages(productPage);
  if (!images.length && shopifyProduct?.images?.length) {
    images.push(
      ...shopifyProduct.images.map((image) => ({
        key: image.url,
        src: image.url,
        alt: image.altText || productPage.title || "",
      })),
    );
  }
  const [karat, thickness, length, weight] = specRow(productPage);

  const productJsonLd = shopifyProduct
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: shopifyProduct.title,
        description: shopifyProduct.description,
        image: shopifyProduct.featuredImage?.url,
        offers: {
          "@type": "AggregateOffer",
          availability: shopifyProduct.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          priceCurrency: shopifyProduct.priceRange.minVariantPrice.currencyCode,
          highPrice: shopifyProduct.priceRange.maxVariantPrice.amount,
          lowPrice: shopifyProduct.priceRange.minVariantPrice.amount,
        },
      }
    : null;

  return (
    <div data-page="product" className={s.page}>
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}

      <div className={`grid ${s.panels}`}>
        <div className={s.left}>
          <h1 className={s.title}>
            <span className={s.number}>{number}</span>
            <span>{productPage.title}</span>
          </h1>
          {productPage.description ? (
            <p className={s.description}>{productPage.description}</p>
          ) : null}
          <CartButton
            product={shopifyProduct}
            price={price}
            className={s.leftButton}
          />
        </div>

        <div className={s.center}>
          <Gallery
            images={images}
            priority
            placeholderThumbnails={productPage.placeholder ? 5 : 0}
          />
        </div>

        <div className={s.right}>
          <SpecColumns
            className={s.specs}
            columns={[[karat], [thickness], [length], [weight]]}
          />
          <div className={s.rightFooter}>
            <div className={s.details}>
              <Accordion title="Materials + Specifications">
                {productPage.materialsAndSpecifications ? (
                  <CustomPortableText
                    value={productPage.materialsAndSpecifications}
                  />
                ) : null}
              </Accordion>
              <Accordion title="Shipping, Returns + Warranties">
                {productPage.shippingReturnsWarranty ? (
                  <CustomPortableText
                    value={productPage.shippingReturnsWarranty}
                  />
                ) : null}
              </Accordion>
            </div>
            <CartButton
              product={shopifyProduct}
              price={price}
              className={s.rightButton}
            />
          </div>
        </div>
      </div>

      <div className={`grid ${s.band}`}>
        <Band />
      </div>
    </div>
  );
}

const PLACEHOLDER_DESCRIPTION =
  "A classic curb chain with flattened, interlocking links that lie flat against the skin with precision-cut facets on the links that increase light reflection and sparkle. Comprised of 9K gold, this timeless necklace has a width of 1 millimetres, length of 42 centimetres and weighs 1.4 grams";
