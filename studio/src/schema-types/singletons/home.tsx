import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  type: "document",
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: "pageBuilder",
      title: "Page builder",
      description:
        "Build the home page out of Product type, Story, and Custom piece sections.",
      type: "array",
      of: [
        { type: "productTypeSection" },
        { type: "storySection" },
        { type: "customPieceSection" },
      ],
    }),
    defineField({
      name: "pageSeo",
      type: "pageSeo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home" }),
  },
});
