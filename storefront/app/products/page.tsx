import type { Metadata } from "next";

import { ProductTypeSection } from "../../components/product-type-section";
import {
  PLACEHOLDER_PRODUCTS,
  ProductCard,
  sortForIndex,
} from "../../data/products";
import { sanityFetch } from "../../data/sanity";
import { INDEX_PRODUCTS_QUERY } from "../../data/sanity/queries";
import s from "../page.module.css";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { type } = await props.searchParams;
  return { title: type ? capitalise(type) : "All Products" };
}

/**
 * All Products. Reached from the header / footer product type links
 * (?type=chains etc.), which filter it to one type; without a type it lists
 * everything, grouped by type. Same tiles and LAMGOLD bands as Home.
 */
export default async function Page(props: Props) {
  const { type } = await props.searchParams;
  const { data } = await sanityFetch({ query: INDEX_PRODUCTS_QUERY });

  let products = (data ?? []) as ProductCard[];
  if (!products.length && process.env.NODE_ENV === "development") {
    products = PLACEHOLDER_PRODUCTS;
  }
  products = sortForIndex(products);

  // One section per type, in Index order
  const types = type
    ? [type]
    : [...new Set(products.map((p) => p.type).filter(Boolean))] as string[];

  const sections = types
    .map((t) => ({ type: t, products: products.filter((p) => p.type === t) }))
    .filter((section) => section.products.length);

  return (
    <div className={s.home}>
      {sections.length ? (
        sections.map((section, i) => (
          <ProductTypeSection
            key={section.type}
            index={i}
            block={{
              _type: "productTypeSection",
              _key: section.type,
              heading: capitalise(section.type),
              productType: section.type,
              products: section.products,
            }}
          />
        ))
      ) : (
        <p className={s.empty}>No {type ?? "products"} yet.</p>
      )}
    </div>
  );
}
