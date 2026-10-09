import { PageBuilder } from "../components/page-builder";
import { IndexSection } from "../components/index-section";
import { sanityFetch } from "../data/sanity/";
import { HOME_QUERY, INDEX_PRODUCTS_QUERY } from "../data/sanity/queries";
import {
  PLACEHOLDER_PRODUCTS,
  ProductCard,
  sortForIndex,
} from "../data/products";
import s from "./page.module.css";

/**
 * Home: the page builder sections (product rows, custom piece, story),
 * then the numbered Index of every product.
 */
export default async function Page() {
  const [{ data: home }, { data: indexProducts }] = await Promise.all([
    sanityFetch({ query: HOME_QUERY }),
    sanityFetch({ query: INDEX_PRODUCTS_QUERY }),
  ]);

  const hasContent = !!home?._id && !!home.pageBuilder?.length;

  // While the dataset is empty, show the Home design's layout in development
  // so it can be checked against the designs (Option+G for the grid).
  if (!hasContent && process.env.NODE_ENV === "development") {
    return (
      <div className={s.home} data-page="home">
        <PageBuilder page={PLACEHOLDER_HOME} />
        <IndexSection products={sortForIndex(PLACEHOLDER_PRODUCTS)} />
      </div>
    );
  }

  if (!home?._id) {
    return <div className={s.home} />;
  }

  return (
    <div className={s.home} data-page="home">
      <PageBuilder page={home} />
      <IndexSection
        products={sortForIndex((indexProducts ?? []) as ProductCard[])}
      />
    </div>
  );
}

const byType = (type: string) =>
  PLACEHOLDER_PRODUCTS.filter((p) => p.type === type);

const PLACEHOLDER_HOME = {
  _id: "placeholder-home",
  _type: "home",
  pageBuilder: [
    {
      _key: "chains",
      _type: "productTypeSection",
      productType: "chains",
      products: byType("chains").slice(0, 9),
    },
    {
      _key: "custom",
      _type: "customPieceSection",
      products: [
        PLACEHOLDER_PRODUCTS[0],
        ...byType("pendants"),
        { ...byType("pendants")[0], _id: "placeholder-pendant-2" },
      ],
      description:
        "Custom pieces can be crafted in your choice of karat with accompanying engraving, embossing, stone setting, inlay, and enamel work, to create a truly one of a kind piece.",
      karats: ["14K", "9K"],
      thicknesses: ["4.1mm", "3.3mm", "3mm", "2.8mm", "2.1mm", "1.8mm", "1.6mm", "1.4mm", "1.2mm", "0.85mm"],
      lengths: ["50cm", "42cm", "16cm", "50mm", "30mm", "22mm", "16mm", "14mm", "12mm"],
      weights: ["2.37g", "1.75g", "1.55g", "1.45g", "1.4g", "1.38g", "1.2g", "0.93g", "0.8g"],
      materialsAndSpecifications: [
        {
          _type: "block",
          _key: "m",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "m1",
              marks: [],
              text: "A classic curb chain with flattened, interlocking links that lie flat against the skin with precision-cut facets on the links that increase light reflection and sparkle. Comprised of 9K gold, this timeless necklace has a width of 1 millimetres, length of 42 centimetres and weighs 1.4 grams",
            },
          ],
        },
      ],
      priceLabel: "AU$ 500 - 1000",
    },
    {
      _key: "bracelets",
      _type: "productTypeSection",
      productType: "bracelets",
      products: byType("bracelets"),
    },
    {
      _key: "story",
      _type: "storySection",
      heading: "Our Story",
      body: [
        {
          _type: "block",
          _key: "b",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "b1",
              marks: [],
              text: "All of our pieces are created with timeless forms in mind. After carefully selecting the highest quality standards of gold, we look into a range of production methods to see what chain link style would best serve each material, and would be a style we’d always love to wear. Beyond this, we look for timeless forms in mind. After carefully selecting the highest quality standards of gold, we look into a range of production methods to see what chain link style would best serve each material, and would be a style we’d always love to wear. timeless forms in mind. After carefully selecting the highest quality standards of gold, we look into a range of production methods to see what chain link style would best serve each material, and would be a style we’d always love to wear.",
            },
          ],
        },
      ],
    },
    {
      _key: "earrings",
      _type: "productTypeSection",
      productType: "earrings",
      products: byType("earrings"),
    },
  ],
};
