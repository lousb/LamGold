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
      name: "steps",
      title: "Steps",
      description: "Numbered 01., 02., ... under the description.",
      type: "array",
      of: [{ type: "text", rows: 2 }],
    }),
    defineField({
      name: "heroExcerpt",
      title: "Hero excerpt",
      description: "Shown under the steps, after a rule.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      description:
        "Necklace lengths in centimetres. Inches are worked out on the site; the diagram labels use these values.",
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
