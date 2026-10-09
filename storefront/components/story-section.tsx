import { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "./custom-portable-text";
import s from "./home.module.css";

export type StorySectionBlock = {
  _type: "storySection";
  _key: string;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
};

/**
 * Home page builder block. Desktop: body in columns 17-24 at the top,
 * heading in column 5 at the bottom. Mobile: body full width, heading
 * bottom right.
 */
export function StorySection({ block }: { block: StorySectionBlock }) {
  const { heading, body } = block;

  return (
    <section className={`grid ${s.story}`} id="story">
      <div className={s.storyBody}>
        {body ? <CustomPortableText value={body} /> : null}
      </div>
      {heading ? <h2 className={s.storyHeading}>{heading}</h2> : null}
    </section>
  );
}

export default StorySection;
