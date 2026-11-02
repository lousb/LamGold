import { defineField, defineType } from "sanity";
import { ShopifyIcon } from "../../components/shopify-icon";
import { ShopifyDocumentStatus } from "../../components/shopify/shopify-document-status";
import { getPriceRange } from "../../utils/get-price-range";
import { PRODUCT_TYPE_OPTIONS } from "../objects/global/footer";

const GROUPS = [
  {
    default: true,
    name: "editorial",
    title: "Details",
  },
  {
    name: "shopifySync",
    title: "Shopify (read-only)",
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
      description: "Edit the title and price in Shopify. They sync here automatically.",
      type: "proxyString",
      options: { field: "store.title" },
    }),
    defineField({
      name: "slugProxy",
      title: "Web address",
      type: "proxyString",
      options: { field: "store.slug.current" },
    }),
    defineField({
      name: "images",
      title: "Images",
      description:
        "The first image is the main one on the home page and product page. If empty, the Shopify image is used.",
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
      description: "Decides which section of the home page and footer this product appears under.",
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
      previewImageUrl: "store.previewImageUrl",
      priceRange: "store.priceRange",
      status: "store.status",
      title: "store.title",
      type: "type",
    },
    prepare(selection) {
      const {
        isDeleted,
        previewImageUrl,
        priceRange,
        status,
        title,
        type,
      } = selection;

      const typeLabel = PRODUCT_TYPE_OPTIONS.find((o) => o.value === type)?.title;
      let subtitle = [typeLabel ?? "No type set", getPriceRange(priceRange)]
        .filter(Boolean)
        .join(" · ");
      if (status !== "active") {
        subtitle = "(Unavailable in Shopify)";
      }
      if (isDeleted) {
        subtitle = "(Deleted from Shopify)";
      }

      return {
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
