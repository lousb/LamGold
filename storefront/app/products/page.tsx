import NextImage from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import Price from "../../components/price";
import { sanityFetch } from "../../data/sanity";
import { ALL_PRODUCTS_QUERY, PRODUCTS_BY_TYPE_QUERY } from "../../data/sanity/queries";
import { getProducts } from "../../data/shopify";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

/**
 * All Products page. Reached directly for SEO, or from the footer's product
 * type links (?type=necklaces etc.), in which case it's filtered to that
 * LamGold product type instead of showing everything.
 */
export default async function Page(props: Props) {
  const { type } = await props.searchParams;

  if (type) {
    const { data: products } = await sanityFetch({
      query: PRODUCTS_BY_TYPE_QUERY,
      params: { type },
    });

    if (!products?.length) return notFound();

    return (
      <div className="block-space">
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
                      objectFit="cover"
                      sizes="33vw"
                    />
                  ) : null}
                </figure>
                <figcaption>{product.store?.title}</figcaption>
                {product.store?.priceRange ? (
                  <p>
                    <Price
                      amount={product.store.priceRange.minVariantPrice.amount}
                      currencyCode={
                        product.store.priceRange.minVariantPrice.currencyCode
                      }
                    />
                  </p>
                ) : null}
              </NextLink>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // get the syncTags from lcapi so we can revalidate the shopify queries
  const { tags } = await sanityFetch({ query: ALL_PRODUCTS_QUERY });

  const products = await getProducts({ tags });

  if (!products) {
    return notFound();
  }

  return (
    <div className="block-space">
      <div className="main-grid">
        {products.map((product) => {
          return (
            <article key={product.id}>
              <NextLink href={`/products/${product.handle}`}>
                <figure className="product-card">
                  <NextImage
                    src={product.featuredImage.url || ""}
                    fill
                    alt={`Image for product: ${product.title}`}
                    objectFit="cover"
                    sizes={"33vw"}
                  />
                </figure>
                <figcaption>{product.title}</figcaption>
                <p>
                  <Price
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={
                      product.priceRange.maxVariantPrice.currencyCode
                    }
                  />
                </p>
              </NextLink>
            </article>
          );
        })}
      </div>
    </div>
  );
}
