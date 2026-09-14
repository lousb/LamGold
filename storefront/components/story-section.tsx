import { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "./custom-portable-text";
import { SanityImage } from "./sanity-image";

export type StorySectionBlock = {
  _type: "storySection";
  _key: string;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
  image?: any;
};

export function StorySection({ block }: { block: StorySectionBlock }) {
  const { heading, body, image } = block;

  return (
    <section className="block-space container">
      {image?.asset ? (
        <div className="relative full-height">
          <SanityImage image={image} />
        </div>
      ) : null}
      {heading ? <h2>{heading}</h2> : null}
      {body ? <CustomPortableText value={body} /> : null}
    </section>
  );
}

export default StorySection;
