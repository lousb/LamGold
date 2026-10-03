import { DiamondIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const KARATS = [
  { name: "karat24", title: "24k" },
  { name: "karat18", title: "18k" },
  { name: "karat14", title: "14k" },
  { name: "karat9", title: "9k" },
];

export const karatGuide = defineType({
  name: "karatGuide",
  title: "Karat Guide",
  type: "document",
  icon: DiamondIcon,
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "picture",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "karatGuide",
      title: "Karat guide",
      type: "object",
      options: { collapsible: false },
      fields: KARATS.map(({ name, title }) =>
        defineField({
          name,
          title: `${title} description`,
          type: "text",
          rows: 3,
        }),
      ),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Karat Guide" }),
  },
});
