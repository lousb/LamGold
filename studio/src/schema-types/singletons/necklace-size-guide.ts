import { ExpandIcon } from "@sanity/icons/Expand";
import { defineField, defineType } from "sanity";

const SIZES = [
  { name: "xs", title: "XS" },
  { name: "s", title: "S" },
  { name: "m", title: "M" },
  { name: "l", title: "L" },
  { name: "xl", title: "XL" },
];

export const necklaceSizeGuide = defineType({
  name: "necklaceSizeGuide",
  title: "Necklace Size Guide",
  type: "document",
  icon: ExpandIcon,
  fields: [
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroExcerpt",
      title: "Hero excerpt",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "picture",
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      description: "Necklace lengths in centimetres.",
      type: "object",
      options: { collapsible: false, columns: 5 },
      fields: SIZES.map(({ name, title }) =>
        defineField({
          name,
          title: `${title} (cm)`,
          type: "number",
          validation: (rule) => rule.positive(),
        }),
      ),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Necklace Size Guide" }),
  },
});
