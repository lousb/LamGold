import { defineField, defineType } from "sanity";

/**
 * Privacy Policy content. Lives on the Settings singleton under its own
 * "Privacy Policy" tab.
 */
export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Privacy Policy",
  type: "object",
  options: { collapsible: false },
  fields: [
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "dataWeCollect",
      title: "Data we collect",
      type: "blockContent",
    }),
    defineField({
      name: "legalBases",
      title: "Legal bases",
      type: "blockContent",
    }),
    defineField({
      name: "howWeUseDataPersonal",
      title: "How we use your data (personal)",
      type: "blockContent",
    }),
    defineField({
      name: "howWeUseDataCommercial",
      title: "How we use your data (commercial)",
      type: "blockContent",
    }),
    defineField({
      name: "dataRetention",
      title: "Data retention",
      type: "blockContent",
    }),
  ],
});
