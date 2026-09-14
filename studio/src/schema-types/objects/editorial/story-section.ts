import { defineField, defineType } from "sanity";

/**
 * Home page builder block: brand / story content, e.g. "Our story",
 * material sourcing, craftsmanship, etc.
 */
export const storySection = defineType({
  name: "storySection",
  title: "Story section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "picture",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      media: "image",
    },
    prepare({ heading, media }) {
      return {
        title: heading || "Story section",
        media,
      };
    },
  },
});
