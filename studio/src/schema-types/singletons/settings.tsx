import { CogIcon } from "@sanity/icons/Cog";
import { LockIcon } from "@sanity/icons/Lock";
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
    { name: "general", title: "General", icon: CogIcon, default: true },
    { name: "privacyPolicy", title: "Privacy Policy", icon: LockIcon },
  ],
  fields: [
    defineField({
      name: "title",
      group: "general",
      type: "string",
      description: "The title of your storefront.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "header",
      group: "general",
      type: "header",
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
      name: "footer",
      group: "general",
      type: "footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerImage",
      group: "general",
      title: "Footer image",
      type: "picture",
    }),
    defineField({
      name: "metadataBase",
      group: "general",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
      description: (
        <span>
          {
            "The base url of your website. It should include protocol and full domain name. example -> https://mydomain.com"
          }
          <a
            href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
            rel="noreferrer noopener"
            target="_blank"
          >
            More information
          </a>
        </span>
      ),
    }),
    defineField({
      name: "privacyPolicy",
      title: "Privacy Policy",
      type: "privacyPolicy",
      group: "privacyPolicy",
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
