import { defineField, defineType } from "sanity";
import { PRODUCT_TYPE_OPTIONS } from "../global/footer";

/**
 * Home page builder block: lists all products belonging to a chosen
 * product type (e.g. all "Necklaces").
 */
export const productTypeSection = defineType({
  name: "productTypeSection",
  title: "Product type section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional heading shown above the products, e.g. 'Necklaces'.",
    }),
    defineField({
      name: "productType",
      title: "Product type",
      type: "string",
      description: "Which product type's products to list.",
      options: {
        list: PRODUCT_TYPE_OPTIONS,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      productType: "productType",
    },
    prepare({ heading, productType }) {
      return {
        title: heading || "Product type section",
        subtitle: productType ? `Type: ${productType}` : "No type selected",
      };
    },
  },
});
