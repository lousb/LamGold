import NextImage from "next/image";
import NextLink from "next/link";
import Price from "./price";

export type ProductTypeSectionBlock = {
  _type: "productTypeSection";
  _key: string;
  heading?: string | null;
  productType?: string | null;
  products?: Array<{ _id: string; store?: any }> | null;
};

/**
 * Home page builder block: lists all products belonging to a chosen
 * product type (e.g. all "Necklaces"). The product list is resolved at
 * query time (see homePageBuilderFields in data/sanity/queries.ts) rather
 * than fetched here, since this component is rendered inside the
 * page-builder's client component tree and can't use server-only data
 * fetching directly.
 */
export function ProductTypeSection({ block }: { block: ProductTypeSectionBlock }) {
  const { heading, productType, products } = block;

  if (!productType || !products?.length) return null;

  return (
    <section className="block-space container">
      <h2>{heading || productType}</h2>
      <div className="main-grid">
        {products.map((product) => (
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
