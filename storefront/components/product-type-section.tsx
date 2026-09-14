import NextImage from "next/image";
import NextLink from "next/link";
import { sanityFetch } from "../data/sanity";
import { PRODUCTS_BY_TYPE_QUERY } from "../data/sanity/queries";
import Price from "./price";

export type ProductTypeSectionBlock = {
  _type: "productTypeSection";
  _key: string;
  heading?: string | null;
  productType?: string | null;
};

/**
 * Home page builder block: lists all products belonging to a chosen
 * product type (e.g. all "Necklaces").
 */
export async function ProductTypeSection({
  block,
}: {
  block: ProductTypeSectionBlock;
}) {
  const { heading, productType } = block;

  if (!productType) return null;

  const { data: products } = await sanityFetch({
    query: PRODUCTS_BY_TYPE_QUERY,
    params: { type: productType },
  });

  if (!products?.length) return null;

  return (
    <section className="block-space container">
      <h2>{heading || productType}</h2>
      <div className="main-grid">
        {products.map((product: any) => (
          <article key={product._id}>
            <NextLink href={`/products/${product.store?.slug?.current}`}>
              <figure className="product-card">
                {product.store?.previewImageUrl ? (
                  <NextImage
                    src={product.store.previewImageUrl}
                    fill
                    alt={`Image for product: ${product.store?.title}`}
                    objectFit="contain"
                    sizes="33vw"
                  />
                ) : null}
                <figcaption>
                  <span>{product.store?.title}</span>
                  {product.store?.priceRange ? (
                    <span>
                      <Price
                        amount={product.store.priceRange.minVariantPrice.amount}
                        currencyCode={
                          product.store.priceRange.minVariantPrice.currencyCode
                        }
                      />
                    </span>
                  ) : null}
                </figcaption>
              </figure>
            </NextLink>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductTypeSection;
