import { ProductCard } from "../data/products";
import { ProductTile } from "./product-tile/product-tile";
import { Band } from "./wordmark/wordmark";
import s from "./home.module.css";

export type ProductTypeSectionBlock = {
  _type: "productTypeSection";
  _key: string;
  heading?: string | null;
  productType?: string | null;
  products?: ProductCard[] | null;
};

/**
 * Home page builder block: every product of one type, three to a row on
 * desktop (one on mobile), with the LAMGOLD band under each row.
 * No band under the last row when a Story section follows (desktop only).
 */
export function ProductTypeSection({
  block,
  index = 0,
  nextType,
}: {
  block: ProductTypeSectionBlock;
  index?: number;
  nextType?: string;
}) {
  const { productType, products } = block;

  if (!products?.length) return null;

  return (
    <section
      id={productType ?? undefined}
      className={s.rows}
      aria-label={block.heading || productType || "Products"}
    >
      {products.map((product, i) => {
        const isLast = i === products.length - 1;
        const endsRow = (i + 1) % 3 === 0 || isLast;
        const bandMobileOnly =
          !endsRow || (isLast && nextType === "storySection");

        return [
          <ProductTile
            key={product._id}
            product={product}
            priority={index === 0 && i < 3}
          />,
          <Band key={`${product._id}-band`} mobileOnly={bandMobileOnly} />,
        ];
      })}
    </section>
  );
}

export default ProductTypeSection;
