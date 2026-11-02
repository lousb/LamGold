import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

/**
 * A link in the footer (Info / Connect columns). Pick what it points to,
 * then fill in the one field that appears.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "linkType",
      title: "Links to",
      type: "string",
      initialValue: "page",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Info page", value: "page" },
          { title: "Product", value: "product" },
          { title: "All products", value: "plp" },
          { title: "Home", value: "home" },
          { title: "Web address / email", value: "href" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "page",
      title: "Info page",
      type: "reference",
      weak: true,
      to: [{ type: "infoPage" }],
      hidden: ({ parent }) => parent?.linkType !== "page",
      validation: (rule) =>
        rule.custom((value, context: any) =>
          context.parent?.linkType === "page" && !value
            ? "Choose an info page"
            : true,
        ),
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      weak: true,
      to: [{ type: "product" }],
      hidden: ({ parent }) => parent?.linkType !== "product",
      validation: (rule) =>
        rule.custom((value, context: any) =>
          context.parent?.linkType === "product" && !value
            ? "Choose a product"
            : true,
        ),
    }),
    defineField({
      name: "href",
      title: "Web address",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "href",
      description:
        "e.g. https://instagram.com/lamgold, mailto:hello@lamgold.com, or /karat-guide",
      validation: (rule) =>
        rule
          .uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] })
          .custom((value, context: any) =>
            context.parent?.linkType === "href" && !value
              ? "Enter a web address"
              : true,
          ),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "The text people see. Optional for pages and products (their name is used), required for web addresses.",
      validation: (rule) =>
        rule.custom((value, context: any) =>
          context.parent?.linkType === "href" && !value
            ? "Add a label for this web address"
            : true,
        ),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      linkType: "linkType",
      label: "label",
      pageTitle: "page.title",
      pageSlug: "page.slug.current",
      productName: "product.store.title",
      productSlug: "product.store.slug.current",
      href: "href",
    },
    prepare(s) {
      const byType: Record<string, [string | undefined, string]> = {
        page: [s.pageTitle, `/${s.pageSlug ?? ""}`],
        product: [s.productName, `/products/${s.productSlug ?? ""}`],
        plp: ["All products", "/products"],
        home: ["Home", "/"],
        href: [s.href, s.href ?? ""],
      };
      const [name, path] = byType[s.linkType] ?? ["Link", ""];
      return { title: s.label || name || "Untitled link", subtitle: path };
    },
  },
});
