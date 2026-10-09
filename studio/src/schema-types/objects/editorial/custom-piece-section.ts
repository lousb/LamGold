import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Home page builder block: promotes made-to-order / custom pieces.
 *
 * Layout (Home design): a row of example products, then three panels -
 * description + enquiry button / main image / options table, Materials +
 * Specifications, Shipping and a second enquiry button.
 */
export const customPieceSection = defineType({
  name: "customPieceSection",
  title: "Custom piece section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      description: "Not shown on the page; used to label the section in the Studio.",
      type: "string",
    }),
    defineField({
      name: "products",
      title: "Example products",
      description: "Shown as a row of product tiles above the custom piece panels (up to 3).",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "The first is the main image; the rest show as thumbnails on mobile.",
      type: "array",
      of: [{ type: "picture" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "karats",
      title: "Karats",
      description: "e.g. 14K, 9K",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "thicknesses",
      title: "Thicknesses",
      description: "e.g. 4.1mm",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "lengths",
      title: "Lengths",
      description: "e.g. 50cm",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "weights",
      title: "Weights",
      description: "e.g. 2.37g",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "materialsAndSpecifications",
      title: "Materials + Specifications",
      type: "blockContent",
    }),
    defineField({
      name: "priceLabel",
      title: "Price label",
      description: "e.g. AU$ 500 - 1000",
      type: "string",
    }),
    defineField({
      name: "buttonLabel",
      title: "Enquiry button label",
      description:
        "Both buttons open the Custom Enquiry overlay. Defaults to “Request Custom Piece”.",
      type: "string",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      media: "images.0",
    },
    prepare({ heading, media }) {
      return {
        title: heading || "Custom piece section",
        media,
      };
    },
  },
});
