import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared list of product type options, used both here (for footer filter
 * links) and on the Product document's `type` field. Keeping this in one
 * place means the two stay in sync - add a new jewellery type here and it
 * shows up in both places.
 */
export const PRODUCT_TYPE_OPTIONS = [
  { title: "Necklaces", value: "necklaces" },
  { title: "Chains", value: "chains" },
  { title: "Pendants", value: "pendants" },
  { title: "Earrings", value: "earrings" },
  { title: "Bracelets", value: "bracelets" },
  { title: "Rings", value: "rings" },
];

/**
 * Footer schema object for LamGold.
 * Three columns as specified in the project brief:
 *  - Products: the list of product types, used to generate filter links
 *  - Info links: array of {title, link}
 *  - Connect links: array of {title, link}
 */
export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "object",
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: "productTypes",
      title: "Products (filter links)",
      description:
        "The product types shown as filter links in the footer. Each one links to the all-products view filtered to that type.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: PRODUCT_TYPE_OPTIONS,
      },
    }),
    defineField({
      name: "infoLinks",
      title: "Info links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({
      name: "connectLinks",
      title: "Connect links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
  ],
});
