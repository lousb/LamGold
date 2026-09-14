import { LinkFieldsType } from "../data/sanity/queries";
import { ResolvedLink } from "./resolved-link";
import { SanityImage } from "./sanity-image";

export type CustomPieceSectionBlock = {
  _type: "customPieceSection";
  _key: string;
  heading?: string | null;
  description?: string | null;
  image?: any;
  cta?: LinkFieldsType | null;
};

export function CustomPieceSection({
  block,
}: {
  block: CustomPieceSectionBlock;
}) {
  const { heading, description, image, cta } = block;

  return (
    <section className="block-space container">
      {image?.asset ? (
        <div className="relative full-height">
          <SanityImage image={image} />
        </div>
      ) : null}
      {heading ? <h2>{heading}</h2> : null}
      {description ? <p>{description}</p> : null}
      {cta ? (
        <ResolvedLink link={cta}>
          {cta.label || "Enquire about a custom piece"}
        </ResolvedLink>
      ) : null}
    </section>
  );
}

export default CustomPieceSection;
