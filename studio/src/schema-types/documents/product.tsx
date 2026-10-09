import pluralize from "pluralize-esm";
import { defineField, defineType } from "sanity";
import { ShopifyIcon } from "../../components/shopify-icon";
import { ShopifyDocumentStatus } from "../../components/shopify/shopify-document-status";
import { getPriceRange } from "../../utils/get-price-range";
import { PRODUCT_TYPE_OPTIONS } from "../objects/global/footer";

const GROUPS = [
  {
    default: true,
    name: "editorial",
    title: "Editorial",
  },
  {
    name: "shopifySync",
    title: "Shopify sync",
    icon: ShopifyIcon,
  },
];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: GROUPS,
  fields: [
    defineField({
      name: "titleProxy",
      title: "Title",
      type: "proxyString",
      options: { field: "store.title" },
    }),
    defineField({
      name: "slugProxy",
      title: "Slug",
      type: "proxyString",
      options: { field: "store.slug.current" },
    }),
    defineField({
      name: "images",
      title: "Images",
      description:
        "Editorial images. The first is the main image on the product page and home page tile; the rest show as thumbnails. Falls back to the Shopify image when empty.",
      type: "array",
      group: "editorial",
      of: [{ type: "picture" }],
      options: { layout: "grid" },
    }),
    // Price comes from Shopify (store.priceRange, synced below) so it stays
    // in sync with checkout - it is not duplicated as an editable field here.
    defineField({
      name: "type",
      title: "Type",
      description:
        "Used for filtering the all-products view and for generating footer links.",
      type: "string",
      group: "editorial",
      options: {
        list: PRODUCT_TYPE_OPTIONS,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "editorial",
    }),
    defineField({
      name: "materialsAndSpecifications",
      title: "Materials + Specifications",
      type: "blockContent",
      group: "editorial",
    }),
    defineField({
      name: "carats",
      title: "Carats",
      type: "number",
      group: "editorial",
    }),
    defineField({
      name: "thickness",
      title: "Thickness",
      description: "e.g. 2mm",
      type: "string",
      group: "editorial",
    }),
    defineField({
      name: "length",
      title: "Length",
      description: "e.g. 45cm",
      type: "string",
      group: "editorial",
    }),
    defineField({
      name: "weight",
      title: "Weight",
      description: "e.g. 5g",
      type: "string",
      group: "editorial",
    }),
    defineField({
      name: "shippingReturnsWarrantyOverride",
      title: "Shipping, Returns & Warranty override",
      description:
        "Optional. Defaults to the site-wide value set in Settings when left empty.",
      type: "blockContent",
      group: "editorial",
    }),
    defineField({
      name: "store",
      title: "Shopify",
      type: "shopifyProduct",
      description: "Product data from Shopify (read-only)",
      group: "shopifySync",
    }),
  ],
  preview: {
    select: {
      isDeleted: "store.isDeleted",
      options: "store.options",
      previewImageUrl: "store.previewImageUrl",
      priceRange: "store.priceRange",
      status: "store.status",
      title: "store.title",
      variants: "store.variants",
    },
    prepare(selection) {
      const {
        isDeleted,
        options,
        previewImageUrl,
        priceRange,
        status,
        title,
        variants,
      } = selection;

      const optionCount = options?.length;
      const variantCount = variants?.length;

      const description = [
        variantCount ? pluralize("variant", variantCount, true) : "No variants",
        optionCount ? pluralize("option", optionCount, true) : "No options",
      ];

      let subtitle = getPriceRange(priceRange);
      if (status !== "active") {
        subtitle = "(Unavailable in Shopify)";
      }
      if (isDeleted) {
        subtitle = "(Deleted from Shopify)";
      }

      return {
        description: description.join(" / "),
        subtitle,
        title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === "active"}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      };
    },
  },
});
