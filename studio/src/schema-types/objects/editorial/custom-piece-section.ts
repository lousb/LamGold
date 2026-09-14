import { defineField, defineType } from "sanity";

/**
 * Home page builder block: promotes made-to-order / custom pieces,
 * with an optional call to action (e.g. link to a contact/enquiry page).
 */
export const customPieceSection = defineType({
  name: "customPieceSection",
  title: "Custom piece section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "picture",
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "link",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      media: "image",
    },
    prepare({ heading, media }) {
      return {
        title: heading || "Custom piece section",
        media,
      };
    },
  },
});
