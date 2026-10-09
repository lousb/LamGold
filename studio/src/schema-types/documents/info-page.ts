import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Information page (Information Page design): Privacy Policy, Terms &
 * Conditions, Shipping and Returns, etc.
 *
 * Intro on the left, numbered sections in the middle, page title and
 * "Last updated" on the right. Each section has a title, then groups of
 * a label (left) and a lettered list (right).
 */
export const infoPage = defineType({
  name: "infoPage",
  title: "Information page",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. Privacy Policy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The page's address, e.g. privacy-policy → /privacy-policy",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      options: { dateFormat: "D MMMM YYYY" },
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Numbered automatically (01, 02, ...).",
      type: "array",
      of: [
        defineArrayMember({
          name: "infoSection",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "groups",
              title: "Groups",
              description:
                "Each group is a label (left) with a lettered list beside it (a., b., c.).",
              type: "array",
              of: [
                defineArrayMember({
                  name: "infoGroup",
                  title: "Group",
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "text",
                      rows: 2,
                    }),
                    defineField({
                      name: "items",
                      title: "List items",
                      type: "array",
                      of: [defineArrayMember({ type: "text", rows: 2 })],
                    }),
                  ],
                  preview: {
                    select: { title: "label", items: "items" },
                    prepare: ({ title, items }) => ({
                      title: title || "Group",
                      subtitle: `${items?.length ?? 0} items`,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title: title || "Untitled",
      subtitle: slug ? `/${slug}` : undefined,
    }),
  },
});
