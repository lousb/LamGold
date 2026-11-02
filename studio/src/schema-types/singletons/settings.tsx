import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: "settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "footer", title: "Footer" },
    { name: "advanced", title: "Advanced" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      group: "general",
      type: "string",
      description: "Shown in the browser tab and search results.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shippingReturnsWarranties",
      group: "general",
      title: "Shipping, Returns & Warranties",
      description:
        "Site-wide default. Individual products can override this in their own Shipping, Returns & Warranty field.",
      type: "blockContent",
    }),
    defineField({
      name: "customEnquiryIntro",
      title: "Custom enquiry intro",
      description:
        "Shown at the top of the Custom Enquiry overlay. Leave empty to use the default copy.",
      group: "general",
      type: "blockContent",
    }),
    defineField({
      name: "footer",
      title: "Footer links",
      group: "footer",
      type: "footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerImage",
      group: "footer",
      title: "Footer image",
      type: "picture",
    }),
    defineField({
      name: "metadataBase",
      title: "Website address",
      group: "advanced",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
      description:
        "The live website address, including https://. Used for social sharing previews. You can usually leave this alone.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
});
