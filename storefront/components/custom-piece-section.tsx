import { PortableTextBlock } from "next-sanity";

import { Picture, pictureUrls, ProductCard } from "../data/products";
import { CustomPortableText } from "./custom-portable-text";
import { Gallery } from "./gallery/gallery";
import s from "./home.module.css";
import { ProductTile } from "./product-tile/product-tile";
import { Accordion } from "./ui/accordion";
import { CtaButton } from "./ui/cta-button";
import { SpecColumns } from "./ui/spec-columns";
import { Band } from "./wordmark/wordmark";

export type CustomPieceSectionBlock = {
  _type: "customPieceSection";
  _key: string;
  heading?: string | null;
  products?: ProductCard[] | null;
  description?: string | null;
  images?: Picture[] | null;
  karats?: string[] | null;
  thicknesses?: string[] | null;
  lengths?: string[] | null;
  weights?: string[] | null;
  materialsAndSpecifications?: PortableTextBlock[] | null;
  shippingReturnsWarranties?: PortableTextBlock[] | null;
  priceLabel?: string | null;
  cta?: {
    url?: string | null;
    label?: string | null;
    openInNewTab?: boolean | null;
  } | null;
};

/**
 * Home page builder block.
 * A row of example products, then three panels: description + enquiry
 * button / main image / options table, Materials + Specifications,
 * Shipping and a second enquiry button. LAMGOLD band underneath.
 */
export function CustomPieceSection({
  block,
}: {
  block: CustomPieceSectionBlock;
}) {
  const products = block.products?.filter(Boolean) ?? [];
  const images = pictureUrls(block.images);
  const label = block.cta?.label || "Request Custom Piece";
  // TODO: point at the Custom Enquiry Overlay once it's built
  const href = block.cta?.url || "/contact";
  const newTab = !!block.cta?.openInNewTab;

  const button = (className: string) => (
    <CtaButton
      href={href}
      label={label}
      price={block.priceLabel}
      newTab={newTab}
      className={className}
    />
  );

  return (
    <section id="custom" aria-label={block.heading || "Custom pieces"}>
      {products.length ? (
        <div className={s.rows}>
          {products.map((product, i) => [
            <ProductTile key={product._id} product={product} />,
            i < products.length - 1 ? (
              <Band key={`${product._id}-band`} mobileOnly />
            ) : null,
          ])}
        </div>
      ) : null}

      <div className={`grid ${s.customPanels}`}>
        <div className={s.customLeft}>
          {block.description ? (
            <p className={s.customDescription}>{block.description}</p>
          ) : null}
          {button(s.desktopButton)}
        </div>

        <div className={s.customImage}>
          <Gallery images={images} variant="custom" />
        </div>

        <div className={s.customRight}>
          <SpecColumns
            className={s.customSpecs}
            columns={[
              block.karats ?? [],
              block.thicknesses ?? [],
              block.lengths ?? [],
              block.weights ?? [],
            ]}
          />
          <div className={s.customFooter}>
            <Accordion title="Materials + Specifications" defaultOpen>
              {block.materialsAndSpecifications ? (
                <CustomPortableText value={block.materialsAndSpecifications} />
              ) : null}
            </Accordion>
            <Accordion title="Shipping, Returns + Warranties">
              {block.shippingReturnsWarranties ? (
                <CustomPortableText value={block.shippingReturnsWarranties} />
              ) : null}
            </Accordion>
            {button(s.customButton)}
          </div>
        </div>
      </div>

      <div className="grid">
        <Band />
      </div>
    </section>
  );
}

export default CustomPieceSection;
