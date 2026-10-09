import { defineField, defineType } from "sanity";

/**
 * Home page builder block: brand / story copy.
 * Body sits top-right; the heading (e.g. "Our Story") sits at the bottom.
 */
export const storySection = defineType({
  name: "storySection",
  title: "Story section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      description: "e.g. Our Story",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
    },
    prepare({ heading }) {
      return {
        title: heading || "Story section",
      };
    },
  },
});
